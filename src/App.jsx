import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

// uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const App = () => {

  const [todo, setTodo] = useState("") //for input field
  const [todosData, setTodosData] = useState([]) //for array
  const inputRef = useRef(null); //for autofocus
  const [showFinished, setShowFinished] = useState(false)

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  useEffect(() => {
    let storedTodos = localStorage.getItem("todosData")
    if (storedTodos) {
      setTodosData(JSON.parse(storedTodos))
    }
  }, [])


  useEffect(() => {
    if (todosData.length > 0) {
      localStorage.setItem("todosData", JSON.stringify(todosData));
    }
  }, [todosData])

  const handleEdit = (id) => {
    let t = todosData.find(i => i.id === id)
    setTodo(t.todo)
    setTodosData(prevTodos => prevTodos.filter(todo => todo.id !== id));
    inputRef.current.focus();
  }

  const handleDelete = (id) => {
    // console.log(`The id is ${id}`)
    setTodosData(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }

  const handleAdd = () => {
    if (todo.trim() === "") return;
    setTodosData([...todosData, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    inputRef.current.focus();
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  //Checkbox
  const handleCheckbox = (e) => {
    let id = e.target.name
    setTodosData(prevTodos =>
      prevTodos.map(newTodos =>
        newTodos.id === id ? { ...newTodos, isCompleted: !newTodos.isCompleted } : newTodos
      )
    );
  };


  return (
    <> 
      <Navbar />
      <div className="container md:w-4xl sm:w-lg flex flex-col mx-auto my-5 rounded-xl p-5 bg-blue-200 min-h-[85vh]shadow-gray-400 shadow-2xl">
        <div className="addTodo my-5 gap-2">
          <h2 className='text-lg font-bold'>
            Add a  new todo
          </h2>
          <input
            type="text"
            className='bg-white rounded-full border-1 border-blue-700 p-2 ps-3 md:w-3xl'
            onChange={handleChange}
            value={todo} autoFocus
            ref={inputRef}
          />
          <button
            className='bg-blue-700 hover:bg-blue-900 mx-2 p-3 py-2 font-bold rounded-full text-white transition-all duration-200 cursor-pointer'
            onClick={handleAdd}>
            SAVE
          </button>
        </div>
        <div className='p-1 ps-3 flex items-center'>
          <input onChange={toggleFinished} type="checkbox" checked={showFinished} className='size-5 cursor-pointer' />
          <span className='p-2'>Show Finished</span>
        </div>
        <h2 className='text-lg font-bold'>
          Your Todos
        </h2>

        {todosData.length === 0 && <div className='font-bold text-xl text-rose-500 p-3'><h2>Your Todo list is empty!</h2></div>}

        <div className="todos">
          {todosData.map(item => {
            return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex w-full justify-between my-2 bg-white p-2 ps-6 pe-6 items-center rounded-xl drop-shadow-xl shadow-xl">
              <input name={item.id} onChange={handleCheckbox} type="checkbox" className="checkbox size-6 cursor-pointer" checked={item.isCompleted} />
              <div className={`text-[17px] ${item.isCompleted ? "line-through" : ""}`}>{item.todo}</div>
              <div className="buttons">
                <button
                  className='bg-blue-700 hover:bg-blue-900 mx-1 p-3 py-1  rounded-full text-white transition-all duration-200 cursor-pointer'
                  onClick={() => { handleEdit(item.id) }}>
                  <ModeEditIcon fontSize='medium' />
                </button>
                <button
                  className='bg-blue-700 hover:bg-blue-900 mx-1 p-3 py-1 rounded-full text-white transition-all duration-200 cursor-pointer'
                  onClick={() => { handleDelete(item.id) }}>
                  <DeleteIcon fontSize='medium' />
                </button>
              </div>
            </div>
          })}
        </div>

      </div>
    </>
  )
}

export default App