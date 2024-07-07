import { ResponsiveLine } from '@nivo/line'

type Props= {
    data?:any
}
const Line = (props:Props) => {

    
    const data = [
        {
            id:'Publication',
            data:[
                {
                    x:'2018',
                    y:'12'
                },
                {
                    x:'2019',
                    y:'16'
                },
                {
                    x:'2020',
                    y:'44'
                },
                {
                    x:'2021',
                    y:'32'
                },
                {
                    x:'2022',
                    y:'12'
                },
                {
                    x:'2023',
                    y:'13'
                }
            ]
        },
        {
            id:'Project',
            data:[
                {
                    x:'2018',
                    y:'2'
                },
                {
                    x:'2019',
                    y:'8'
                },
                {
                    x:'2020',
                    y:'12'
                },
                {
                    x:'2021',
                    y:'20'
                },
                {
                    x:'2022',
                    y:'8'
                },
                {
                    x:'2023',
                    y:'23'
                }
            ]
        },
        {
            id:'Patent',
            data:[
                {
                    x:'2018',
                    y:'1'
                },
                {
                    x:'2019',
                    y:'1'
                },
                {
                    x:'2020',
                    y:'4'
                },
                {
                    x:'2021',
                    y:'3'
                },
                {
                    x:'2022',
                    y:'1'
                },
                {
                    x:'2023',
                    y:'3'
                }
            ]
        },
        {
            id:'Consultancy',
            data:[
                {
                    x:'2018',
                    y:'2'
                },
                {
                    x:'2019',
                    y:'6'
                },
                {
                    x:'2020',
                    y:'4'
                },
                {
                    x:'2021',
                    y:'2'
                },
                {
                    x:'2022',
                    y:'2'
                },
                {
                    x:'2023',
                    y:'3'
                }
            ]
        }

    ]

  return (
    <div className=' h-72 md:h-[30rem]'>
        <ResponsiveLine
            data = {props.data ? props.data : data}
            margin={{ top:50, left:50, right:50 , bottom:80}}
            curve='cardinal'
            lineWidth={3}
            enableArea={true}
            areaBlendMode='multiply'
            colors={{scheme:'tableau10'}}
            enablePoints={true}
            pointColor='#f28f61'
            pointSize={8}
            isInteractive={true}
            useMesh={true}
            areaOpacity={0.15}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 100,
                    translateY: 60,
                    itemsSpacing: 5,
                    itemDirection: 'left-to-right',
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    </div>
  )
}

export default Line