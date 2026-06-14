import * as Icons from 'lucide-react';

const iconsToCheck = [
  'Boxes',
  'Cpu',
  'Database',
  'Mail',
  'MessageSquare',
  'Phone',
  'Youtube',
  'Instagram',
  'ArrowRight',
  'ArrowUpRight',
  'ArrowLeft',
  'Box'
];

iconsToCheck.forEach(name => {
  console.log(`${name}: ${Icons[name] ? 'OK' : 'UNDEFINED'}`);
});
