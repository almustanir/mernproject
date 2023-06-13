import {useSelector} from "react-redux"
import {selectAllUsers} from "../users/UsersApiSlice"
import NewNoteForm from "./NewNoteForm"

const NewNote = () => {
  const users = useSelector(selectAllUsers)
  if(!users?.length)return <p>Note Currently available</p>
  const content = <NewNoteForm users = {users}/>
  // return users ? <NewNoteForm users={users} /> : <p>Loading.....</p>
  return content
}

export default NewNote