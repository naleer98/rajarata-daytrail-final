import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import Place from '../src/models/Place.js';
import Itinerary from '../src/models/Itinerary.js';
import placeRoutes from '../src/routes/placeRoutes.js';
import { createPlace, getPlaces, getPlaceById, updatePlace } from '../src/controllers/placeController.js';
import { generateItinerary, saveItinerary } from '../src/controllers/itineraryController.js';
import { planOneDayTrip } from '../src/utils/plannerEngine.js';
import { placeInput } from '../src/utils/validation.js';
import { calculateHaversineDistance } from '../src/utils/distance.js';

process.env.HOME_LAT = '8.3114'; process.env.HOME_LNG = '80.4037';
const id = '0123456789abcdef01234567';
const home = { lat: 8.3114, lng: 80.4037 };
const validPlace = () => ({ _id: id, name: 'Test Lake', category: 'Nature', description: 'Test only', address: 'Test address', coordinates: {...home}, visitDuration: 60, openingTime: '06:00', closingTime: '18:00' });
const response = () => ({ code: 200, status(c) {this.code=c;return this;}, json(body) {this.body=body;return this;} });
const plan = (overrides = {}) => planOneDayTrip({places:[validPlace()],homeCoord:home,...overrides});

test('Distance identity and one degree of latitude', () => {
  assert.equal(calculateHaversineDistance(0,0,0,0),0);
  assert.ok(Math.abs(calculateHaversineDistance(0,0,1,0)-111.195)<0.01);
});
test('Place input rejects out-of-radius location', () => assert.throws(()=>placeInput({...validPlace(),coordinates:{lat:9,lng:80}}),/25 km/));
test('Radius boundary uses precise distance', () => {
  const delta = 25.01/6371*180/Math.PI;
  assert.throws(()=>placeInput({...validPlace(),coordinates:{lat:home.lat+delta,lng:home.lng}}),/25 km/);
});
test('Coordinates reject non-finite and out-of-range values', () => {
  for (const lat of [NaN,Infinity,91,'8.3']) assert.throws(()=>placeInput({...validPlace(),coordinates:{lat,lng:80}}),/latitude/);
});
test('Required text cannot be whitespace', () => assert.throws(()=>placeInput({...validPlace(),name:' '}),/name/));
test('Negative duration rejected', () => assert.throws(()=>placeInput({...validPlace(),visitDuration:-5}),/duration/));
test('Invalid hours rejected, unknown hours accepted', () => {
  assert.throws(()=>placeInput({...validPlace(),openingTime:'25:00'}),/HH:MM/);
  assert.equal(placeInput({...validPlace(),openingTime:'',closingTime:''}).openingTime,'');
});
test('Update input ignores client slug and unrelated fields', () => {
  const input=placeInput({...validPlace(),slug:'attack',owner:'x',distanceFromHome:999});
  assert.equal(input.slug,undefined);assert.equal(input.owner,undefined);assert.equal(input.distanceFromHome,0);
});
test('Create generates required unique slug and preserves inactive status', async t => {
  t.mock.method(Place,'create',async data=> {await new Place(data).validate();return data;});
  const res=response();await createPlace({body:{...validPlace(),isActive:false}},res);
  assert.equal(res.code,201);assert.ok(res.body.data.slug.startsWith('test-lake-'));assert.equal(res.body.data.isActive,false);
});
test('Bad place input returns 400 instead of writing', async () => {
  const res=response(); await createPlace({body:{}},res);assert.equal(res.code,400);
});
test('Public catalogue remains active-only and search treats brackets literally', async t => {
  let query;t.mock.method(Place,'find',q=>{query=q;return {sort:async()=>[]};});
  const res=response();await getPlaces({query:{search:'[',all:'true'}},res);
  assert.equal(res.code,200);assert.equal(query.isActive,true);assert.ok(query.$or[0].name.test('['));
});
test('Inactive detail lookup uses active filter', async t => {
  let query;t.mock.method(Place,'findOne',async q=>{query=q;return null;});
  const res=response();await getPlaceById({params:{id}},res);assert.equal(query.isActive,true);assert.equal(res.code,404);
});
test('Invalid detail ID returns 400',async()=>{const res=response();await getPlaceById({params:{id:'bad'}},res);assert.equal(res.code,400);});
test('Empty itinerary is rejected',()=>assert.throws(()=>plan({places:[]}),/select/));
test('Start time and pace validated',()=>{
  assert.throws(()=>plan({startTime:'26:00'}),/HH:MM/);
  assert.throws(()=>plan({pace:'Unknown'}),/pace/);
});
test('Nearest-next ordering chooses closer place first',()=>{
  const far={...validPlace(),_id:'1123456789abcdef01234567',coordinates:{lat:8.4,lng:80.4}};
  const result=plan({places:[far,validPlace()]});assert.equal(result.routeOrder[0].place._id,id);
});
test('Pace adjusts visit duration',()=>{
  assert.equal(plan({pace:'Relaxed'}).routeOrder[0].stayDurationMinutes,75);
  assert.equal(plan({pace:'Fast'}).routeOrder[0].stayDurationMinutes,45);
});
test('Missing schedule creates no fabricated warning',()=>{
  assert.deepEqual(plan({places:[{...validPlace(),openingTime:undefined,closingTime:undefined}]}).warnings,[]);
});
test('Early and late arrivals produce warnings',()=>{
  assert.ok(plan({startTime:'04:00'}).warnings.some(x=>x.includes('Early Arrival')));
  assert.ok(plan({startTime:'19:00'}).warnings.some(x=>x.includes('Schedule Alert')));
});
test('Visit extending past closing produces warning',()=>assert.ok(plan({startTime:'17:30'}).warnings.some(x=>x.includes('finish after closing'))));
test('Overnight opening hours are handled',()=>{
  assert.deepEqual(plan({startTime:'01:00',places:[{...validPlace(),openingTime:'22:00',closingTime:'06:00'}]}).warnings,[]);
});
test('Plan ending next day explicitly warns',()=>{
  const result=plan({startTime:'23:30'});assert.equal(result.endDayOffset,1);assert.match(result.expectedEndTime,/day/);assert.ok(result.warnings.some(x=>x.includes('beyond')));
});
test('Return journey included in timing',()=>{
  const result=plan();assert.equal(result.totalTravelMinutes,10);assert.equal(result.totalDurationMinutes,70);assert.equal(result.expectedEndTime24,'09:10');
});
test('Generate rejects unavailable selections rather than silently dropping them',async t=>{
  t.mock.method(Place,'find',async()=>[]);const res=response();await generateItinerary({body:{placeIds:[id]}},res);assert.equal(res.code,409);
});
test('Generate rejects malformed ID',async()=>{const res=response();await generateItinerary({body:{placeIds:['bad']}},res);assert.equal(res.code,400);});
test('Save recomputes totals and records current owner',async t=>{
  t.mock.method(Place,'find',async()=>[validPlace()]);
  t.mock.method(Itinerary,'create',async data=>{await new Itinerary(data).validate();return data;});
  const res=response();await saveItinerary({user:{_id:id},body:{selectedPlaces:[id],totalDistance:999,totalTravelTime:999}},res);
  assert.equal(res.code,201);assert.equal(res.body.data.totalDistance,0);assert.equal(res.body.data.totalTravelTime,10);assert.equal(res.body.data.userId,id);
});
test('Authenticated-only all-places route rejects anonymous HTTP request',async()=>{
  const app=express();app.use('/places',placeRoutes);
  const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
  try{const res=await fetch(`http://127.0.0.1:${server.address().port}/places?all=true`);assert.equal(res.status,401);}finally{server.close();}
});
