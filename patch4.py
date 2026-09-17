import os

for path in ['app/api/notifications/route.ts', 'app/api/notifications/[id]/read/route.ts']:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    c = c.replace('getSession', 'getCurrentSession')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)

monitor = 'lib/monitoring/opportunity-monitor.ts'
with open(monitor, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('import { jobicyProvider }', 'import { JobicyJobProvider }')
c = c.replace('import { himalayasProvider }', 'import { HimalayasJobProvider }')
c = c.replace('import { themuseProvider }', 'import { TheMuseJobProvider }')
c = c.replace('import { adzunaProvider }', 'import { AdzunaJobProvider }')
c = c.replace('import { joobleProvider }', 'import { JoobleJobProvider }')
c = c.replace('import { weworkremotelyProvider }', 'import { WeWorkRemotelyJobProvider }')
c = c.replace('import { remoteokProvider }', 'import { RemoteOkJobProvider }')
c = c.replace('const PROVIDERS: IOnlineJobProvider[] = [\n  jobicyProvider,\n  himalayasProvider,\n  themuseProvider,\n  adzunaProvider,\n  joobleProvider,\n  weworkremotelyProvider,\n  remoteokProvider\n];', 'const PROVIDERS: IOnlineJobProvider[] = [\n  new JobicyJobProvider(),\n  new HimalayasJobProvider(),\n  new TheMuseJobProvider(),\n  new AdzunaJobProvider(),\n  new JoobleJobProvider(),\n  new WeWorkRemotelyJobProvider(),\n  new RemoteOkJobProvider()\n];')

with open(monitor, 'w', encoding='utf-8') as f:
    f.write(c)
