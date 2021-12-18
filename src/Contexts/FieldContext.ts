import React from "react";
import defaulFieldContext from "./FieldContext.default";

export interface FieldContext{
    cellWidth: number;
}

export default React.createContext<FieldContext>(defaulFieldContext);