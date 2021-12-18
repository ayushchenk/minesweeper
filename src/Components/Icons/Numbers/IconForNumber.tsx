import React from "react";
import { NumberEightIcon } from "./NumberEightIcon";
import { NumberFiveIcon } from "./NumberFiveIcon";
import { NumberFourIcon } from "./NumberFourIcon";
import { NumberOneIcon } from "./NumberOneIcon";
import { NumberSevenIcon } from "./NumberSevenIcon";
import { NumberSixIcon } from "./NumberSixIcon";
import { NumberThreeIcon } from "./NumberThreeIcon";
import { NumberTwoIcon } from "./NumberTwoIcon";


export function IconForNumber(props: { children: any }) {
    switch (props.children) {
        case 1: return <NumberOneIcon></NumberOneIcon>;
        case 2: return <NumberTwoIcon></NumberTwoIcon>;
        case 3: return <NumberThreeIcon></NumberThreeIcon>;
        case 4: return <NumberFourIcon></NumberFourIcon>;
        case 5: return <NumberFiveIcon></NumberFiveIcon>;
        case 6: return <NumberSixIcon></NumberSixIcon>;
        case 7: return <NumberSevenIcon></NumberSevenIcon>;
        case 8: return <NumberEightIcon></NumberEightIcon>;
        default: return <></>;
    }
}