import { useState } from 'react';
import Button from '../../button/Button';
import './RequestForm.css';

export default function RequestForm({ order, onCancel, onSave }) {
    const [title, setTitle] = useState(order?.title ?? '');
    const [vendor, setVendor] = useState(order?.vendor ?? '');
    const [base, setBase] = useState(String(order?.breakdown?.base ?? ''));
    const [shipping, setShipping] = useState(String(order?.breakdown?.shipping ?? '0'));
    const [tax, setTax] = useState(String(order?.breakdown?.tax ?? '0'));
    const [date, setDate] = useState(order?.date ?? '');
    const [tags, setTags] = useState((order?.tags ?? []).join(', '));

    const baseAmount = Number(base) || 0;
    const shippingAmount = Number(shipping) || 0;
    const taxAmount = Number(tax) || 0;
    const total = baseAmount + shippingAmount + taxAmount;

    const handleSubmit = (event) => {
        event.preventDefault();

        const existingQuotes = order?.quotes ?? [];
        const bestIndex = Math.max(0, existingQuotes.findIndex((quote) => quote.best));
        const quotes = existingQuotes.length
            ? existingQuotes.map((quote, index) => (
                index === bestIndex
                    ? { ...quote, vendor: vendor.trim(), amount: total, best: true }
                    : { ...quote, best: false }
            ))
            : [{ vendor: vendor.trim(), amount: total, lead: 'To be confirmed', best: true }];

        const nextOrder = {
            ...(order ?? {}),
            title: title.trim(),
            vendor: vendor.trim(),
            amount: total,
            date: date.trim(),
            tags: [...new Set(tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))],
            breakdown: {
                base: baseAmount,
                shipping: shippingAmount,
                tax: taxAmount
            },
            quotes,
            directorSigned: order?.directorSigned ?? false
        };

        onSave(nextOrder);
    };

    return (
        <>
            <header className="request-form-head">
                <div>
                    <p className="request-form-eyebrow">{order ? 'Edit request' : 'New request'}</p>
                    <h2>{order ? order.id : 'Purchase request'}</h2>
                </div>
                <Button variant="close" onClick={onCancel} ariaLabel="Close Request Form">×</Button>
            </header>

            <form className="request-form" onSubmit={handleSubmit}>
                <div className="request-form-fields">
                    <label className="request-form-field request-form-wide">
                        <span>What do you need?</span>
                        <input
                            autoFocus
                            required
                            maxLength={120}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Item or service"
                        />
                    </label>

                    <label className="request-form-field request-form-wide">
                        <span>Preferred vendor</span>
                        <input
                            required
                            maxLength={80}
                            value={vendor}
                            onChange={(event) => setVendor(event.target.value)}
                            placeholder="Vendor name"
                        />
                    </label>

                    <label className="request-form-field">
                        <span>Base cost</span>
                        <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={base}
                            onChange={(event) => setBase(event.target.value)}
                            placeholder="0.00"
                        />
                    </label>

                    <label className="request-form-field">
                        <span>Shipping</span>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={shipping}
                            onChange={(event) => setShipping(event.target.value)}
                            placeholder="0.00"
                        />
                    </label>

                    <label className="request-form-field">
                        <span>Estimated tax</span>
                        <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={tax}
                            onChange={(event) => setTax(event.target.value)}
                            placeholder="0.00"
                        />
                    </label>

                    <div className="request-form-total">
                        <span>Request total</span>
                        <strong>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>

                    <label className="request-form-field request-form-wide">
                        <span>Needed by</span>
                        <input
                            required
                            maxLength={40}
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                            placeholder="e.g. Jun 12"
                        />
                    </label>

                    <label className="request-form-field request-form-wide">
                        <span>Tags <small>Separate with commas</small></span>
                        <input
                            value={tags}
                            onChange={(event) => setTags(event.target.value)}
                            placeholder="materials, urgent"
                        />
                    </label>
                </div>

                <footer className="request-form-actions">
                    <button className="request-form-cancel" type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <Button variant="primary">{order ? 'Save changes' : 'Create request'}</Button>
                </footer>
            </form>
        </>
    );
}
