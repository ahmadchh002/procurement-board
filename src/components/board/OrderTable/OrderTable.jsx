import { useState } from 'react';
import Badge from '../../common/Badge/Badge';
import { STAGES, DIRECTOR_LIMIT } from '../../../utils/constants';
import './OrderTable.css';

export default function OrderTable({
    orders,
    selectedOrderId,
    onOrderClick,
    onStageChange,
}) {
    const [sortAsc, setSortAsc] = useState(false);
    const [sortByAmount, setSortByAmount] = useState(false);

    const displayedOrders = [...orders].sort((a, b) => {
        if (!sortByAmount) return 0;
        return sortAsc ? a.amount - b.amount : b.amount - a.amount;
    });

    const toggleAmountSort = () => {
        if (!sortByAmount) {
            setSortByAmount(true);
            setSortAsc(false);
        } else {
            setSortAsc((prev) => !prev);
        }
    };

    return (
        <div className="table-wrapper">
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>PR #</th>
                        <th>TITLE</th>
                        <th>STATUS</th>
                        <th>VENDOR</th>
                        <th className="sortable-th" onClick={toggleAmountSort}>
                            TOTAL AMOUNT {sortByAmount ? (sortAsc ? '↑' : '↓') : '↕'}
                        </th>
                        <th>DATE</th>
                        <th>TAGS</th>
                        <th>DIRECTOR SIGNED</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedOrders.map((order) => {
                        const currentStage = STAGES.find((s) => s.id === order.stage);
                        const requiresSignoff = order.amount > DIRECTOR_LIMIT;

                        return (
                            <tr
                                key={order.id}
                                className={selectedOrderId === order.id ? 'selected-row' : ''}
                                onClick={() => onOrderClick(order)}
                            >
                                <td className="mono-id">{order.id}</td>
                                <td className="row-title">{order.title}</td>

                                <td onClick={(e) => e.stopPropagation()}>
                                    <div className="status-cell">
                                        <span
                                            className="status-dot"
                                            style={{ background: currentStage?.accent }}
                                        />
                                        <select
                                            className="table-stage-select"
                                            value={order.stage}
                                            onChange={(e) => onStageChange(order.id, e.target.value)}
                                        >
                                            {STAGES.map((s) => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </td>

                                <td className="muted-cell">{order.vendor}</td>
                                <td>${order.amount.toLocaleString()}</td>
                                <td className="muted-cell">{order.date}</td>

                                <td>
                                    <div className="table-tags">
                                        {order.tags.map((tag) => (
                                            <Badge key={tag} variant={tag}>{tag}</Badge>
                                        ))}
                                    </div>
                                </td>

                                <td>
                                    {requiresSignoff ? (
                                        <Badge
                                            type="director"
                                            variant={order.directorSigned ? 'signed' : 'pending'}
                                        />
                                    ) : (
                                        <span className="muted-cell">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}