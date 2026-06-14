import * as Icons from 'lucide-react';

const icons = ['ArrowRight', 'Mail', 'MessageSquare', 'Phone', 'Check', 'AlertTriangle', 'Send'];
icons.forEach(name => {
  console.log(`${name}: ${Icons[name] ? 'OK' : 'UNDEFINED'}`);
});
