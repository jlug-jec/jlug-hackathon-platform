'use server'

import { checkExistingTeam, createTeam, updateTeam } from "../../lib/firebase/utils";

export async function checkAndCreateTeam(email: string, teamData: any) {
  try {

    const teamCheck = await checkExistingTeam(email);
    

    if (teamData) {
      try {
        console.log(teamData)
        const response = await fetch(process.env.NEXT_SCRIPT_URL, {
          method: 'POST',
          body: JSON.stringify(teamData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const responseText = await response.text();
        console.log('Spreadsheet response:', responseText);
        
      } catch (error) {
        console.error('Error logging team data to spreadsheet:', error);
      }
    }
    
    if (teamCheck.exists && !teamData) {
      return {
        success: true,
        exists: true,
        team: teamCheck.team,
        message: 'Existing team found, Updating Team'
      };
    }

    if (teamCheck.exists && teamData) {
      const result = await updateTeam(teamData); 
      return {
        success: true,
        exists: true,
        team:result,
        message: 'Team updated successfully'
      };
    }


    const result = await createTeam(teamData);
    return {
      success: result.success,
      exists: false,
      message: result.success ? 'Team created successfully' : result.error
    };
  } catch (error) {
    return {
      success: false,
      exists: false,
      message: 'Something went wrong'
    };
  }
}