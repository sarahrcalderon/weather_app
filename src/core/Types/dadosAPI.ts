export interface IClimaResponse {
    erro?: string;
    clima: {
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        main: {
            temp: number;
        };
    };
    qualidade_ar: {
        list: Array<{
            main: {
                aqi: number;
            };
        }>;
    };
}
