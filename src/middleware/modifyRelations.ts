import { prisma } from '../index'

async function updateRelationsIncrementally(
    mainId: number,
    newRelatedIds: number[],
    relationModel: "userContent" | "classContent" | "classUser",
    mainField: string,
    relatedField: string
) {
    // Obtém relações existentes
    const existingRelations = await (prisma as any)[relationModel].findMany({
        where: { [mainField]: mainId },
        select: { [relatedField]: true },
    });
    // Obtém ids das relações existentes
    const existingIds = existingRelations.map((relation:any) => relation[relatedField]);

    // Calcula relações para adicionar e remover
    const toAdd = newRelatedIds.filter((id:number) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id:number) => !newRelatedIds.includes(id));

    // Adiciona novas relações
    if (toAdd.length) {
        const data = toAdd.map((id) => ({
            [mainField]: mainId,
            [relatedField]: id,
        }));
        await (prisma as any)[relationModel].createMany({ data });
    }

    // Remove relações antigas
    if (toRemove.length) {
        await (prisma as any)[relationModel].deleteMany({
            where: {
                [mainField]: mainId,
                [relatedField]: { in: toRemove },
            },
        });
    }
}


/*
await upsertRelations(
  1,                 // ID principal
  [2, 3],            // IDs relacionados
  "userContent",     // Nome do modelo de relação
  "userId",          // Campo do principal
  "contentId"        // Campo do relacionado
)
*/