const fs = require('fs');

['app/api/notifications/route.ts', 'app/api/notifications/[id]/read/route.ts'].forEach(path => {
    let c = fs.readFileSync(path, 'utf8');
    c = c.replace(/getSession/g, 'getCurrentSession');
    fs.writeFileSync(path, c);
});

const monitor = 'lib/monitoring/opportunity-monitor.ts';
let c = fs.readFileSync(monitor, 'utf8');
c = c.replace('import { jobicyProvider }', 'import { JobicyJobProvider }');
c = c.replace('import { himalayasProvider }', 'import { HimalayasJobProvider }');
c = c.replace('import { themuseProvider }', 'import { TheMuseJobProvider }');
c = c.replace('import { adzunaProvider }', 'import { AdzunaJobProvider }');
c = c.replace('import { joobleProvider }', 'import { JoobleJobProvider }');
c = c.replace('import { weworkremotelyProvider }', 'import { WeWorkRemotelyJobProvider }');
c = c.replace('import { remoteokProvider }', 'import { RemoteOkJobProvider }');

c = c.replace('const PROVIDERS: IOnlineJobProvider[] = [', 'const PROVIDERS: IOnlineJobProvider[] = [\n  new JobicyJobProvider(),\n  new HimalayasJobProvider(),\n  new TheMuseJobProvider(),\n  new AdzunaJobProvider(),\n  new JoobleJobProvider(),\n  new WeWorkRemotelyJobProvider(),\n  new RemoteOkJobProvider()\n];\n/*');

c = c.replace('remoteokProvider\n];', 'remoteokProvider\n];*/');

c = c.replace(/limit:\s*\d+,/g, '');

fs.writeFileSync(monitor, c);
