export interface Column {
	name: string;
	label: string;
	align: 'left' | 'center' | 'right';
	required?: boolean;
	field: string;
	format?: (val: any) => any;
	sortable?: boolean;
	style?: string;
}