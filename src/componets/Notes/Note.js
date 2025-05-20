

const Note = (props) => {
    
    const {title ,id , noteClicked , active} = props

    return (
      <div>  <li className={`notes-item ${active && 'active' }`} onClick={noteClicked}> {title} </li>

<li className={`notes-item ${active && 'active' }`} onClick={noteClicked}> {id} </li>
 </div>  
        
    );
}
 

export default Note;