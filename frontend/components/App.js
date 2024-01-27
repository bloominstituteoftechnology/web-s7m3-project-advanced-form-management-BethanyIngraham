// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import * as yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const initialValues = () => ({
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: false
}) 
//These keys match names of inputs


const initialErrors = () => ({
  username: '',
  favLanguage: '',
  favFood: '',
  agreement: ''
}) 
//Why a helper function instead of an object?
//Test app by filling these out!

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const schema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: yup
    .string()
    .trim()
    .required(e.favLanguageRequired)
    .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup
    .string()
    .trim()
    .required(e.favFoodRequired)
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [values, setValues] = useState(initialValues());
  const [errors, setErrors] = useState(initialErrors());
  const [isFormEnabled, setIsFormEnabled] = useState(false); //when form is not complete, disable submit buttom / boolean prefix is/has
  const [successMessage, setSuccessMessage] = useState(''); //on post, success message is put into this state (green box)
  const [failureMessage, setFailureMessage] = useState(''); //on post, failure message is put into this state (red box)


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    schema.isValid(values)
    .then(setIsFormEnabled)
    .catch(err => console.log(err))
  }, [values])
 

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    //console.log('hello') -> used to test values and checked, you'll see handlers firing
    let {name, type, value, checked} = evt.target;
    value = type === 'checkbox' ? checked : value 
    //we only care about checked prop for checkbox, not value
    setValues({...values, [name] : value}) 
    //pass fresh state from prev. values and override name with value
    //check react dev tools - components - to see changes -> values state changes
    yup.reach(schema, name).validate(value)
      .then(() => setErrors({...errors, [name]:''}))
      .catch((err) => setErrors({...errors, [name]: err.errors[0]}))
    //check new value to see if it validates
    //validates -> clear the error message
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post('https://webapis.bloomtechdev.com/registration', values)
        .then(res => {
          //console.log(res.data)
          setValues(initialValues())
          setSuccessMessage(res.data.message) //check network
          setFailureMessage('')
        })
        .catch(err => {
          setFailureMessage(err.response.data.message) //check network
          setSuccessMessage('')
          //debugger
        })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        { successMessage && <h4 className="success">{successMessage}</h4> }
        {/**Only needs to render if slice of state is not undefined or null -> it's a truthy value*/}
        { failureMessage && <h4 className="error">{failureMessage}</h4> }
        
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input value={values.username}  onChange={onChange} id="username" name="username" type="text" placeholder="Type Username"/>
          {errors.username && <div className="validation">{errors.username}</div>}
          {/**It's aware of state!  -> if this is truthy, this div will render -> don't hard code text!*/}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input checked={values.favLanguage === 'javascript'} onChange={onChange} type="radio" name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input checked={values.favLanguage === 'rust'} onChange={onChange} type="radio" name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={values.favFood} onChange={onChange} id="favFood" name="favFood" >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input checked={values.agreement} onChange={onChange} id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
         { errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input disabled={!isFormEnabled} type="submit" />
        </div>
      </form>
    </div>
  )
}

