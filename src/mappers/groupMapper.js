// Capa de adaptadores: convierte un grupo del backend a la forma que usan
// los componentes. Un grupo se chatea a través de su conversation_id.
export const mapGroup = (group) => ({
    group_id: group._id,
    conversation_id: group.conversation_id,
    name: group.name,
    description: group.description || '',
    avatar_url: group.avatar_url || null,
    is_group: true
})
