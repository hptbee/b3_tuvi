import assert from 'node:assert/strict';
const {analyzeChartRequest: current}=await import('/workspace/b3_tuvi/backend/src/interpretation/analyze.js');
const {analyzeChartRequest: base}=await import('/tmp/t030/performance-baseline/backend/src/interpretation/analyze.js');
const birth={day:1,month:1,year:1984,hour:0,gender:1};let count=0;
for(const age of [null,1,4,13,14,123,124,125]) {const body={...birth,...(age?{majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal',nominalAge:age}}:{})};assert.deepEqual(current(body),base(body));count++;}
console.log(JSON.stringify({baseline:'774ac6cff4b74e273a9bdf3a9c1ffa180d3d6b7b',fullAnalyzerResponsesExactlyEqual:count}));
