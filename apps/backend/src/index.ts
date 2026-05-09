import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { prisma } from './lib/prisma';

const app = new Elysia({ adapter: node() })
	.get('/', async () => {
    const res = await prisma.test.findMany();
    return res;
  })
	.listen(3000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	});
