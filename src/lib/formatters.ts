const CURRENY_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    });

export function formatCurrency(amount: number){
    return CURRENY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export function formatNumber(amount: number){
    return NUMBER_FORMATTER.format(amount);
}