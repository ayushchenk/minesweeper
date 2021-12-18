import { Field } from '../Field/Field';
import FieldContext from '../../Contexts/FieldContext';
import defaulFieldContext from '../../Contexts/FieldContext.default';

export function App() {
    return (
        <div className='app'>
            <FieldContext.Provider value={defaulFieldContext}>
                <Field
                    rows={10}
                    columns={10}
                    minesCount={25}>
                </Field>
            </FieldContext.Provider>
        </div>
    );
}   