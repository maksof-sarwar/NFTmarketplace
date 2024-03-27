import { Prisma, prisma } from "@marketplace/db";
import { SocketHandler } from "@marketplace/socket/server";
import { fetchTokens } from "./nft-tokens-fetcher";
import { MetadataMap } from "./nft-tokens-fetcher/type";
const interval = 30 * 60 * 1000; // 1 hour in milliseconds

export const startFetchingToken = () => {
  console.log('startFetchingToken script started');
  const process = async () => {
    console.log('start fetching token on Date:', new Date().toLocaleString());
    const queues = await prisma.queue.findMany({
      where: { status: "TODO" }, select: {
        id: true,
        collection: {
          select: {
            address: true,
            metadata: true
          }
        }
      }
    })
    console.log("no of active queues", queues.length);
    for (const queue of queues) {
      try {
        console.log('processing colllection queue', queue.collection.address);
        await prisma.queue.update({ data: { status: "IN_PROGRESS" }, where: { id: queue.id } })
        const res = await fetchTokens(queue.collection.address)
        if (res) {
          await saveTokens(res.traits, res.metadataMap, res.collection.id, queue.id)
          SocketHandler.instance.io.emit('token_fetching_done', {
            address: queue.collection.address,
            name: (queue.collection.metadata as any)?.name,
          })
        }
      } catch (error: any) {
        console.log('Error : collection queue model => ', error);
        await prisma.queue.update({ data: { status: 'FAILED' }, where: { id: queue.id } })
        SocketHandler.instance.io.emit('token_fetching_done', {
          address: queue.collection.address,
          name: (queue.collection.metadata as any)?.name,
        })
      }
    }
  }
  process()
  setInterval(process, interval);
}


async function saveTokens(traits: Prisma.JsonValue, metadataMap: MetadataMap, collectionId: string, queueId: string) {
  await prisma.$connect()
  await prisma.$transaction(async tx => {
    for (const metadata of Object.values(metadataMap)) {
      const data = {
        image: metadata.image,
        name: metadata.name,
        attributes: metadata.attributes,
        rarity: metadata.rarity,
        metadata,
      }
      await tx.collectionToken.upsert({
        create: { ...data, collectionId: collectionId, tokenId: metadata.id, },
        update: data,
        where: {
          collectionId_tokenId: {
            collectionId,
            tokenId: metadata.id
          }
        }
      })
    }

    await tx.collection.update({
      data: {
        traits,
      },
      where: {
        id: collectionId,
      }
    })
    await tx.queue.update({ data: { status: 'DONE' }, where: { id: queueId } })
  }, {
    maxWait: 60 * 1000, // default: 2000
    timeout: 5 * 60 * 1000, // default: 5000
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
  })
  await prisma.$disconnect()
}