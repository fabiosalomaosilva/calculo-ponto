import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface TimeProps {
    date: Date;
    hoursInit: string;
    hoursLunchStart: string;
    hoursLunchEnd: string;
    hoursEnd: string;
    workHours: string;
    hoursLunchTotal: string;
    extraHours: string;
}

const TimeTrackingForm = () => {
    const [timeEntries, setTimeEntries] = useState<TimeProps[]>([]);
    const [formData, setFormData] = useState({
        hoursInit: '',
        hoursLunchStart: '',
        hoursLunchEnd: '',
        hoursEnd: '',
        date: new Date().toString().split('T')[0]
    });

    const calculateHours = (data: typeof formData): Partial<TimeProps> => {
        // Convert times to minutes for easier calculation
        const init = convertToMinutes(data.hoursInit);
        const lunchStart = convertToMinutes(data.hoursLunchStart);
        const lunchEnd = convertToMinutes(data.hoursLunchEnd);
        const end = convertToMinutes(data.hoursEnd);

        // Calculate work hours excluding lunch
        const morningWork = lunchStart - init;
        const afternoonWork = end - lunchEnd;
        const totalWork = morningWork + afternoonWork;

        // Calculate lunch hours
        const lunchTime = lunchEnd - lunchStart;

        // Calculate extra hours (anything over 8 hours)
        const regularWork = 8 * 60; // 8 hours in minutes
        const extraWork = Math.max(0, totalWork - regularWork);

        return {
            workHours: minutesToTimeString(totalWork),
            hoursLunchTotal: minutesToTimeString(lunchTime),
            extraHours: minutesToTimeString(extraWork)
        };
    };

    const convertToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const minutesToTimeString = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const calculatedTimes = calculateHours(formData);

        const { date, ...restFormData } = formData;

        // Corrigindo a criação da data para considerar o fuso horário local
        const [year, month, day] = date.split('-').map(Number);
        const newEntry: TimeProps = {
            date: new Date(year, month - 1, day), // Mês começa em 0 no JavaScript
            ...restFormData,
            ...calculatedTimes as Pick<TimeProps, 'workHours' | 'hoursLunchTotal' | 'extraHours'>
        };

        setTimeEntries([...timeEntries, newEntry]);
        setFormData({ hoursInit: '', hoursLunchStart: '', hoursLunchEnd: '', hoursEnd: '', date });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <h1 className="text-4xl font-bold mb-10 text-teal-500">Calcular horas para o ponto</h1>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hoursInit">Entrada</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hoursInit">Entrada</Label>
                                <Input
                                    id="hoursInit"
                                    name="hoursInit"
                                    type="time"
                                    required
                                    value={formData.hoursInit}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hoursLunchStart">Saída Almoço</Label>
                                <Input
                                    id="hoursLunchStart"
                                    name="hoursLunchStart"
                                    type="time"
                                    required
                                    value={formData.hoursLunchStart}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hoursLunchEnd">Retorno Almoço</Label>
                                <Input
                                    id="hoursLunchEnd"
                                    name="hoursLunchEnd"
                                    type="time"
                                    required
                                    value={formData.hoursLunchEnd}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hoursEnd">Saída</Label>
                                <Input
                                    id="hoursEnd"
                                    name="hoursEnd"
                                    type="time"
                                    required
                                    value={formData.hoursEnd}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="space-y-2 flex justify-end items-end">
                                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 w-full">
                                    Adicionar
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {timeEntries.map((entry) => (
                    <Card key={entry.date.toISOString()} className="border-l-4 border-l-emerald-500">
                        <CardContent className="py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-emerald-500" size={20} />
                                    <span className="font-medium">
                                        Data: {entry.date.toLocaleDateString('pt-BR')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-start w-[60px]">
                                        <span className="text-sm font-semibold text-gray-600">Entrada</span>
                                        <span className="bg-emerald-500 text-white px-2 py-1 rounded">
                                            {entry.hoursInit}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-start w-[60px]">
                                        <span className="text-sm font-semibold text-gray-600">Intervalo</span>
                                        <span className="bg-emerald-500 text-white px-2 py-1 rounded">
                                            {entry.hoursLunchStart}
                                        </span>
                                    </div>


                                    <div className="flex flex-col items-start w-[60px]">
                                        <span className="text-sm font-semibold text-gray-600">Fim</span>
                                        <span className="bg-emerald-500 text-white px-2 py-1 rounded">
                                            {entry.hoursLunchEnd}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-start w-[60px]">
                                        <span className="text-sm font-semibold text-gray-600">Saída</span>
                                        <span className="bg-emerald-500 text-white px-2 py-1 rounded">
                                            {entry.hoursEnd}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-start w-[100px]">
                                        <span className="text-sm font-semibold text-gray-600">Total de horas</span>
                                        <span className="bg-emerald-700 text-white px-2 py-1 rounded">
                                            {entry.workHours}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-start w-[100px]">
                                        <span className="text-sm font-semibold text-gray-600">Horas extras</span>
                                        <span className="bg-emerald-700 text-white px-2 py-1 rounded">
                                            {entry.extraHours}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-start w-[100px]">
                                        <span className="text-sm font-semibold text-gray-600">Horas intervalo</span>
                                        <span className="bg-emerald-700 text-white px-2 py-1 rounded">
                                            {entry.hoursLunchTotal}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TimeTrackingForm;