'use server'
// Will Delete pg if it is not used not sure if I will need it at some point
import {eq} from "drizzle-orm"
import { users, skillsToUsers, skills } from "@/database/schema"
import { database, pg} from "@/database/index"

// Select Statements for User Profile

export async function userData(id:string)
{    
    const data = await database.select({field1: users.name, field2: users.image, field3: users.bio }).from(users).where(eq(users.id, id))

    return data;
}

export async function userSkills(id:string)
{
    const data = await database.select({field1: skillsToUsers.skillId, field2: skills.name, field3: skills.iconUrl }).from(skillsToUsers).innerJoin(skills, eq(skills.id, skillsToUsers.skillId)).where(eq(skillsToUsers.volunteerId, id))
        
    return data; 
}

export async function userName(id:string) 
{
    const data = await database.select({field1: users.name}).from(users).where(eq(users.id, id))

    return data;    
}


export async function userBio(id:string) 
{
    const data = await database.select({field1: users.bio}).from(users).where(eq(users.id, id))

    return data;   
}


export async function userImage(id:string) 
{
    const data = await database.select({field1: users.image}).from(users).where(eq(users.id, id))

    return data;    
}


// Update and delete Statements for UserProfile
// Will add returns latter not sure what to do with them.

export async function deleteUserSkill(id:string, skill:string)
{
   await database.delete(skillsToUsers).where(eq(skillsToUsers.volunteerId, id) && eq(skillsToUsers.skillId, skill))
}

export async function addUserSkill(id:string, skill:string)
{
    await database.insert(skillsToUsers).values({skillId: skill, volunteerId: id})
}

export async function updateName(id:string, username:string) 
{
    await database.update(users).set({name: username}).where(eq(users.id, id))
}

export async function updateImage(id:string, userImage:string) 
{
    await database.update(users).set({name: userImage}).where(eq(users.id, id))
}

export async function updateBio(id:string, userBio:string) 
{
    await database.update(users).set({name: userBio}).where(eq(users.id, id))
}

// Select Statements for Org Profile



// Update and delete statements for Org Profile