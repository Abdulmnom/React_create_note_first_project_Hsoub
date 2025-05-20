import './App.css';
import React , {useState , useEffect} from 'react';
import Preview from './componets/Preview'
import Message from './componets/message';
import NotesContainer from './componets/Notes/NotesContainer';
import NoteList from './componets/Notes/NoteList';
import Note from './componets/Notes/Note';
import NoteForm from './componets/Notes/NoteForm';
import Alert from './componets/Alert';





function App() {

  const [notes , setNotes] = useState([]);
  const [title , setTitle] = useState('');
  const [content , setContent] = useState('');
  const [selectedNote , setSelectedNote] = useState(null);
  const [ creating, setCreating] = useState(false);
  const [editing , setEditing] = useState(false);
  const [deleting , setDeleting] = useState(false);
  const [validationErrors , setValidationErrors] = useState([]);



   useEffect(() => {
    if (localStorage.getItem('notes')) {
      // تحويل البيانات الى مصفوفة من Json to the javascript parse
      setNotes(JSON.parse(localStorage.getItem('notes')));

    } else {
      // json to the javascript stringify
      localStorage.setItem('notes' , JSON.stringify([]));

    }
   },[])

   useEffect(() => {
    if (validationErrors.length !== 0 && validationErrors.length > 0) {
    setTimeout(() => {
      setValidationErrors([]);
    }, 3000);
    }
    })


   const saveToLocalStorage = (key , value) => {
    localStorage.setItem(key , JSON.stringify(value));
   };

   const validate = () => {
    const validationErrors = [];
    let  passed = true;
    if(!title) {
      validationErrors.push('الرجاء ادخال عنوان الملاحضة');
      passed = false;
    }
    if(!content) {
      validationErrors.push('الرجاء ادخال محتوى الملاحضة');
      passed = false;
    }
    if(!passed) {
      setValidationErrors(validationErrors);
    }
    return passed;

    }

  // تغيير عنوان الملاحضة

  const changeTitleHandler=(event)  => {
   setTitle(event.target.value);
  };



  //تغيير محتوى الملاحضة
  // target تعبر عن الحدث الذي طبق عليه الحدث
  const changeContentHandler = (event) => {
    setContent(event.target.value)
  }


  //حفض محتوى الملاحضة

  const saveNodeHandler = (event) => {
    // Prevent default form submission behavior if needed
    if (event && event.preventDefault) {
      event.preventDefault();
    }
   

    // Validate the form inputs
    if(!validate()) {
      return;
    }

    // Create a new note object
    const note = {
      id: new Date().getTime(), // Using timestamp for unique ID
      title: title,
      content: content
    }

    // Add the new note to the existing notes array
    const updatedNotes = [...notes, note];

    // Save to localStorage and update state
    saveToLocalStorage('notes', updatedNotes);
    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle('');
    setContent('');
  };



  // تعديل ملاحضة

  const updatedNoteHandler = () => {
    if(!validate()) {
      return;
    }

    const updatedNotes = [...notes];
    const noteindex = updatedNotes.find(note => note.id === selectedNote);
    noteindex.title = title;
    noteindex.content = content;
    setNotes(updatedNotes);
    setEditing(false);


    saveToLocalStorage('notes' , updatedNotes);
    setNotes(updatedNotes);
    setEditing(false);
    setTitle('');
    setContent('');
  }


// حذف الملاحضة
const deleteNoteHandler = () => {
  const updatedNotes = notes.filter(note => note.id !== selectedNote);

  saveToLocalStorage('notes', updatedNotes);
  setNotes(updatedNotes);
  setDeleting(false);
  setSelectedNote(null);
  setEditing(false);
  setTitle('');
  setContent('');
};



// اختيار ملاحضة
const selectedNoteHandler = (noteId) => {
  setSelectedNote(noteId);
  setCreating(false);
  setEditing(false);
  setDeleting(false);
};


 // الانتقال الى وضع تعديل الملاحضة


 const editNoteHandler = () => {
  const selected = notes.find(note => note.id === selectedNote);

  if (!selected) {
    return;
  }

  setEditing(true);
  setTitle(selected.title);
  setContent(selected.content);
};


  const getAddNote = () => {
    return (
      <NoteForm
        formTitle="اضافة ملاحضة"
        title={title}
        content={content}
        titleChange={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitClickd={saveNodeHandler}
        submitText="حفظ"
      />
    )
  };

  // دالة عرض الملاحضة
  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title="لا يوجد ملاحظة جديدة" />;
    }

    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظة" />;
    }

    const note = notes.find(note => note.id === selectedNote);

    if (!note) {
      return <Message title="الملاحظة غير موجودة" />;
    }

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="تعديل الملاحظة"
          title={title}
          content={content}
          titleChange={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitClickd={updatedNoteHandler}
          submitText="تعديل"
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };



  // الانتقال الى وضع اضافة ملاحضة
  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle('');
    setContent('');

  }


  return (
    <div className="App">
      <NotesContainer>
        <Message title="ملاحضاتي" />

       <NoteList>
  {notes.map(note => (
    <Note
      key={note.id}
      title={note.title}
      noteClicked={() => selectedNoteHandler(note.id)}
      active={selectedNote === note.id}
    />
  ))};

</NoteList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {/* chek the error Alert */}
      {validationErrors.length > 0 && <Alert validationMessages={validationErrors} />}

    </div>
  );
}

export default App;

