'use server'

import { checkExistingTeam, createTeam, updateTeam } from "@/lib/firebase/utils";

export async function checkAndCreateTeam(email: string, teamData: any) {
  try {
    const teamCheck = await checkExistingTeam(email);
    
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

    // Create new team
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