import { prisma } from '../index'

export async function updateRelations(
    _id: number,
    newRelatedIds: number[],
    relationModel: string,
    mainField: string,  //campo principal do model utilizado
    relatedField: string
) {
    const prismaModel = (prisma as any)[relationModel]
    // Obtém relações existentes
    const existingRelations = await prismaModel.findMany({
        where: { [mainField]: _id },
        select: { [relatedField]: true },
    });
    // Obtém ids das relações existentes
    const existingIds = existingRelations.map((relation:any) => relation[relatedField]);

    // Calcula relações para adicionar e remover
    const toAdd = newRelatedIds.filter((id:number) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id:number) => !newRelatedIds.includes(id));
    let removedOrder, createdOrder;
    // Adiciona novas relações
    
    if (toAdd.length) {
        const data = toAdd.map((id) => ({
            [mainField]: _id,
            [relatedField]: id,
        }))
        createdOrder = await prismaModel.createMany({ data });
    }// {mainField: _id, relatedField: id}
    // Remove relações antigas
    if (toRemove.length) {
        removedOrder = await prismaModel.deleteMany({
            where: {
                [mainField]: _id,
                [relatedField]: { in: toRemove },
            },
        })
    }
    console.log("Foram criadas", createdOrder, "relações")
    console.log("Foram deletadas", removedOrder, "relações")
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