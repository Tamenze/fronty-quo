import type {Tag} from '../../../types'

type TagCardProps = {
  tag: Tag
}


function TagCard( { tag } : TagCardProps){
  return (
    <div>
      <p>name: {tag.name}</p>
      <p> created at: {tag.created_at}</p>
      {tag.creator && (
        <p>author: {tag.creator.username}</p> 
      )}
    </div>
  )
}

export default TagCard
