<template>
	<div class="home-index-box">
		<!--饼状图and环形图-->
		<div class="graph-pie-warp">
			<el-row :gutter="30">
				<el-col :span="12">
					<div id="home_gathering_source"
						 style="height: 300px; margin:30px 10px; padding: 0px;"></div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
  import * as echarts from 'echarts'
  let gatheringSourceOption = {
    title: {
      text: '最近7日占比图:',
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 0,
      top: 'center',
      icon: 'circle',
      selectedMode: 'multiple',
      formatter: (name) => { //legend显示数据格式化,每一个 legend 渲染都会回调这个函数
        let data = gatheringSourceOption.series[0].data //获取当前对象的series.data
        let total = 0 //数据对象总和存放
        let tarValue = 0 // 当前对象的value 值
        for (let i = 0, l = data.length; i < l; i++) { //循环饼状图数据对象
          total += data[i].value  //计算出当前对象总和
          if (data[i].name == name) {
            tarValue = data[i].value //存放当前渲染的legend 对象
          }
        }
        let p = (tarValue / total * 100).toFixed(2) //百分比保留小数点后两位
        return `${name}  |  ${p}%  `
      }
    },
    series: [
      {
        name: '最近7日占比',
        type: 'pie',
        radius: '60%',
        center: ['25%', '55%'],
        selectedMode: 'single',
        data: [ ],
        label: {
          show: false
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  export default {
    data() {
      return {
        gatheringSourceOption,
      }
    },
	 mounted() {
	    this.getProportionData()//收款的饼图的数据
	},
    methods: {
    eChartsInit(domId, theme, opt) {
        echarts.init(document.getElementById(domId), theme).setOption(opt)
        window.addEventListener('resize', () => {
          echarts.init(document.getElementById(domId), theme).resize()
        })
      },
      //获取收款饼图的数据
      getProportionData() {
		let _this = this;
		var sourceList=[
          { value: 1, name: '苹果' },
          { value: 2, name: '草莓' },
          { value: 2, name: '西瓜' },
          { value: 3, name: '桔子' },
          { value: 2, name: '葡萄' },
          { value: 4, name: '柿子' }
        ]
		this.gatheringSourceOption.series[0].data = sourceList
		this.eChartsInit('home_gathering_source', 'light', this.gatheringSourceOption)
      }
    }
  }
</script>

