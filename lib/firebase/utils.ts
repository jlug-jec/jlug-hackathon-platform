"use server"
import { db } from "./index";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function addUserToFirestore(user: any) {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true;
    }
    const userRef = await addDoc(usersRef, {
      name: user.name,
      email: user.email,
      loginTime: serverTimestamp(),
      status: 'Active',
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {

    return false;
  }
}

export async function checkExistingTeam(userEmail: string) {
  try {
    const teamsRef = collection(db, 'teams');
    const leaderQuery = query(teamsRef, where("teamLeader.email", "==", userEmail));
    const leaderSnapshot = await getDocs(leaderQuery);
    
    if (!leaderSnapshot.empty) {
      return { exists: true, role: 'leader', team: leaderSnapshot.docs[0].data() };
    }

    const memberQuery = query(teamsRef, where("teamMembers", "array-contains", { email: userEmail }));
    const memberSnapshot = await getDocs(memberQuery);

    if (!memberSnapshot.empty) {
      return { exists: true, role: 'member', team: memberSnapshot.docs[0].data() };
    }

    return { exists: false };
  } catch (error) {

    return { exists: false, error };
  }
}

export async function createTeam(teamData: any) {
  try {
    const teamsRef = collection(db, 'teams');
    const teamDoc = await addDoc(teamsRef, {
      ...teamData,
      createdAt: serverTimestamp(),
      status: 'Active'
    });
    
    return { success: true, teamId: teamDoc.id };
  } catch (error) {

    return { success: false, error };
  }
}

export async function updateTeam(teamData: any) {
  try {
    const teamsRef = collection(db, 'teams');
    const teamQuery = query(teamsRef, where("teamLeader.email", "==", teamData.teamLeader.email));
    const teamSnapshot = await getDocs(teamQuery);

    if (teamSnapshot.empty) {
      return { success: false, error: 'Team not found' };
    }

    const teamDoc = doc(db, 'teams', teamSnapshot.docs[0].id);
    await updateDoc(teamDoc, {
      ...teamData,
      updatedAt: serverTimestamp(),
    });

    return { 
      success: true, 
      team: {
        ...teamData,
        updatedAt: new Date().getTime()
      }
    };
  } catch (error) {
    return { success: false, error };
  }
}