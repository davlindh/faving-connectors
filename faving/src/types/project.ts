export interface Project {
  project_id: string;
  project_name: string;
  description: string;
  category: string;
  budget: number;
  start_date: string;
  end_date: string;
  location: string;
  required_skills: string[];
  creator: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  interested_users: Array<{ user_id: string }>;
}