import React from "react";

export default function Talents(props:any) {
    
if(props.talents == null)
    return <div><h1> placeholder </h1></div>;
else
    return <div>{props.talents}</div>

}

