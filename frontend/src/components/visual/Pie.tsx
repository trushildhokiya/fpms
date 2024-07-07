import { ResponsivePie } from '@nivo/pie'

type Props = {
    data?:any
}

const Pie = (props:Props) => {
    
    const data = [
        {
            id: "patent",
            value: 20
        },
        {
            id: 'publication',
            value: 10
        },
        {
            id: 'project',
            value: 22
        },
        {
            id: 'consultancy',
            value: 2
        }
    ]

    return (
        <div className='h-72 w-full'>
            <ResponsivePie
                data={props.data ? props.data : data}
                margin={{ top:50, left:50, right:50, bottom:50}}
                innerRadius={0.6}
                padAngle={1}
                cornerRadius={3}
                sortByValue={true}
                arcLinkLabelsDiagonalLength={8}
                activeOuterRadiusOffset={8}
                arcLabelsTextColor='#000000'
                transitionMode='outerRadius'
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: 'rgba(252, 186, 3, 0.5)',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: 'rgba(230, 98, 16, 0.5)',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'patent'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'publication'
                        },
                        id: 'lines'
                    },
                ]}
                colors={{scheme:'reds'}}
            />
        </div>
    )
}

export default Pie