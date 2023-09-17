import { IsDate, IsNumber, IsString, isNumber } from 'class-validator';

export class CreateObservationDto {

    @IsString()
    stationId: string;
  
    @IsNumber()
    elementId: number;
  
    @IsNumber()
    sourceId: number;
  
    @IsString()
    level: string;
  
  
    datetime: string;
   
    @IsNumber()
    period: number;

    @IsNumber()
    value: number;
  
    @IsString()
    flag: string;
  
    @IsNumber()
    qcStatus: number;

}