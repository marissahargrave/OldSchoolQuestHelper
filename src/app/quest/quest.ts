export interface Quest {
  index: number;
  title: string;
  status: boolean;
  difficulty: string;
  members: boolean;
  length: string;
  questPoints: number;
  userEligible: boolean;
  series: string;
}
//{"title":"A Shadow over Ashdale","status":"COMPLETED","difficulty":0,"members":false,"questPoints":1,"userEligible":true}