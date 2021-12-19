import { Field } from '../Field/Field';
import FieldContext from '../../Contexts/FieldContext';
import defaulFieldContext from '../../Contexts/FieldContext.default';


export function App() {
    return (
        <div className='app'>
            <FieldContext.Provider value={defaulFieldContext}>
                <Field />
            </FieldContext.Provider>
        </div>
    );
}   