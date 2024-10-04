import React from 'react';
import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type DagProps = {};

const initialNodes = [
    { id: '1', position: { x: 20, y: 50 }, data: { label: '1' } },
    { id: '2', position: { x: 20, y: 150 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function Dag(props: DagProps) {
    return (
        <div className={'dag-container'}>
            <div style={{ width: '500px', height: '300px' }}>
                <ReactFlow nodes={initialNodes} edges={initialEdges}>
                    <Background color="red" variant={BackgroundVariant.Cross} />
                </ReactFlow>
            </div>
        </div>
    );
}

export default Dag;
