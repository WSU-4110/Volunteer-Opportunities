'use client'
import UserPicture from './userPicture';
import Name from './name';
import Talents from './orgTalents';
import UserBio from './userBio';
import Organization from './organization';
import { useState } from 'react'

export default function UserPage(props:any) {
   
    const [pageChoice, setChoice] = useState(props.state);


    const changeChoice:any = (check:any) =>{
    console.log(check.target.checked);
    setChoice(check.target.checked);
    }
    
    if (pageChoice) {
        return(
            <div>
                
                <input type="checkbox" name="pageChoice"  id = "pageChoice"  checked = {pageChoice} onChange={changeChoice}></input>
                <div>
                    <UserPicture/>
                    <Name />
                    <Talents />
                    <UserBio />
                </div>     
            </div>
            );  
    }
    else
    {
        return(
            <div>
               
                <input type="checkbox" name="pageChoice"  id = "pageChoice"  checked = {pageChoice} onChange={changeChoice}></input>
                <div>
                    <Organization />
                </div>
                
            </div>
            );  
    }
}

