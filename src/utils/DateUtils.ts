export class DateUtils {
    static formatarDataBR(data: Date | string | null | undefined): string {
        if (!data) return 'N/D';

        const dataObj = typeof data === 'string' ? new Date(data) : data;

        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }
}