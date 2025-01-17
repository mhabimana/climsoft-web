import { Body, Controller, Delete, FileTypeValidator, Get, Header, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, Req, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StationsService } from '../services/stations.service';
import { AuthorisedStationsPipe } from 'src/user/pipes/authorised-stations.pipe';
import { UpdateStationDto } from '../dtos/update-station.dto';
import { CreateStationDto } from '../dtos/create-update-station.dto';
import { ViewStationDto } from '../dtos/view-station.dto';
import { ViewStationQueryDTO } from '../dtos/view-station-query.dto';
import { Admin } from 'src/user/decorators/admin.decorator';
import { AuthUtil } from 'src/user/services/auth.util';
import { Request } from 'express';
import { DateQueryDto } from 'src/shared/dtos/date-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StationsImportExportService } from '../services/stations-import-export.service';
import { FileIOService } from 'src/shared/services/file-io.service';

@Controller('stations')
export class StationsController {
  constructor(
    private stationsService: StationsService,
    private stationImportExportService: StationsImportExportService,
    private fileIOService: FileIOService
  ) { }

  @Get()
  find(
    @Query(AuthorisedStationsPipe) viewQueryDto: ViewStationQueryDTO): Promise<ViewStationDto[]> {
    return this.stationsService.find(viewQueryDto);
  }

  @Get('id/:id')
  findOne(
    @Param('id', AuthorisedStationsPipe) id: string): Promise<ViewStationDto> {
    return this.stationsService.findOne(id);
  }

  @Get('count')
  count(
    @Query() viewQueryDto: ViewStationQueryDTO) {
    return this.stationsService.count(viewQueryDto);
  }

  @Get('updates')
  async updates(
    @Req() request: Request,
    @Query() dateQueryDto: DateQueryDto) {
    const authorisedStationIds = AuthUtil.getLoggedInUser(request).authorisedStationIds;
    return this.stationsService.findUpdatedStations(
      dateQueryDto.date,
      authorisedStationIds ? authorisedStationIds : undefined);
  }

  @Get('download')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="stations.csv"')
  async downloadStationsCsv(
    @Req() request: Request,
  ) {
    // Fetch stations and generate the CSV file
    const csvFilePath = await this.stationImportExportService.exportStationsToCsv(AuthUtil.getLoggedInUser(request).id);

    // Stream the file to the response
    const fileStream = this.fileIOService.createReadStream(csvFilePath);
    return new StreamableFile(fileStream);
  }

  @Admin()
  @Post()
  async create(
    @Req() request: Request,
    @Body() item: CreateStationDto): Promise<ViewStationDto> {
    return this.stationsService.create(item, AuthUtil.getLoggedInUserId(request));
  }

  @Admin()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @Req() request: Request,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 }), // 1MB. 
        new FileTypeValidator({ fileType: 'text/csv' }),
      ]
    })
    ) file: Express.Multer.File) {
    try {
      await this.stationImportExportService.importStations(file, AuthUtil.getLoggedInUserId(request));
      return { message: "success" };
    } catch (error) {
      return { message: `error: ${error}` };
    }
  }

  @Admin()
  @Patch(':id')
  async update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() item: UpdateStationDto): Promise<ViewStationDto> {
    return this.stationsService.update(id, item, AuthUtil.getLoggedInUserId(request));
  }

  @Admin()
  @Delete(':id')
  async delete(
    @Param('id') id: string): Promise<string> {
    return this.stationsService.delete(id);
  }

}
