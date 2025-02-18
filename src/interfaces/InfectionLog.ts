export interface InfectionLog {
  id: string;
  log_file_name: string;
  stealer_type: string;
  computer_information: {
    infection_date: string;
    ip: string;
    country: string;
    os: string;
    malware_path: string;
    username: string;
    hwid: string;
  };
}