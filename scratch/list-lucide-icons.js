import * as Icons from 'lucide-react';

const keys = Object.keys(Icons);
console.log('Total icons:', keys.length);

console.log('Icons starting with Y or containing youtube:');
console.log(keys.filter(k => k.toLowerCase().includes('youtube') || k.toLowerCase().startsWith('y')));

console.log('Icons starting with I or containing instagram:');
console.log(keys.filter(k => k.toLowerCase().includes('instagram') || k.toLowerCase().startsWith('i')));
