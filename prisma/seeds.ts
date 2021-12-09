import { PrismaClient, Prisma } from '@prisma/client';
import { loremIpsum } from 'lorem-ipsum';

const prisma = new PrismaClient();

const NUM_OF_TODOS_PER_USER = 20;

const generateTodos = (): Prisma.TodoCreateWithoutUserInput[] =>
  new Array(NUM_OF_TODOS_PER_USER).fill('').map(() => ({
    title: loremIpsum(),
    isCompleted: Math.random() > 0.5,
  }));

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'fast.nguyen@gmail.com',
    name: 'Fast Nguyen',
    todos: {
      create: generateTodos(),
    },
  },
  {
    email: 'tai.nguyen@gmail.com',
    name: 'Tai Nguyen',
    todos: {
      create: generateTodos(),
    },
  },
  {
    email: 'phuc.nguyen@gmail.com',
    name: 'Phuc Nguyen',
    todos: {
      create: generateTodos(),
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
