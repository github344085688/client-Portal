import BaseService from "./_base-service";

class AppointmentService extends BaseService {
   getAppointmentData(params: object) {
        return this.resource$.post<any>(`/bam/appointment/daily-peroid-sum`, params);
   }

   loadAppointmentList(params: object) {
      return this.resource$.post<any>(`/wms-app/appointment/search`, params);
   }

   removeAppointment(id: string | undefined) {
      return this.resource$.delete<any>(`/bam/appointment/${id}`);
   }

   getAppointmentById(id: string) {
      return this.resource$.get<any>(`/wms-app/appointment/${id}`);
   }

   addAppointment(appointment: any) {
      if (appointment.entryType === 'Receipt') {
         return this.resource$.post<any>("/bam/appointment/inbound", appointment);
      }
      return this.resource$.post<any>("/bam/appointment/outbound", appointment);
   }

   updateAppointment(id: string, appointment: any) {
      if (appointment.entryType === 'Receipt') {
         return this.resource$.put<any>(`/bam/appointment/inbound/${id}`, appointment);
      }
      return this.resource$.put<any>(`/bam/appointment/outbound/${id}`, appointment);
   }
}

let appointmentService =  new AppointmentService();
export default appointmentService;