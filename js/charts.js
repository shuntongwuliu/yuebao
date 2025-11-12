// 图表功能JavaScript文件
// 包含树状图、趋势图、团队分布图等数据可视化功能

// 十月战报数据
const octoberData = {
    // 核心指标数据
    coreMetrics: {
        totalSettlement: 3850, // 万元
        brokerageFee: 520, // 万元
        successRate: 99.2, // 百分比
        returnRate: 90, // 百分比
        professionalTeams: 8, // 支
        riskEventRate: 1.3, // 百分比
        newPartners: 45 // 个
    },
    
    // 月度趋势数据（8-10月真实数据）
    monthlyTrend: {
        august: { settlement: 2800, fee: 380, success: 95, teams: 6 },
        september: { settlement: 3680, fee: 495, success: 99, teams: 8 },
        october: { settlement: 3850, fee: 520, success: 99.2, teams: 8 }
    },
    
    // 团队分布数据
    teamDistribution: {
        '核心团队': 2,
        '运输团队': 3,
        '客服团队': 1,
        '安全团队': 1
    },
    
    // 业务关系树状图数据
    businessTree: {
        name: '恒达运输业务体系',
        children: [
            {
                name: '核心业务',
                children: [
                    {
                        name: '运输服务',
                        children: [
                            { name: '总结算: 3,850万元', value: 3850 },
                            { name: '中介费: 520万元', value: 520 }
                        ]
                    },
                    {
                        name: '服务质量',
                        children: [
                            { name: '成功率: 99.2%', value: 99.2 },
                            { name: '回头率: 90%', value: 90 }
                        ]
                    }
                ]
            },
            {
                name: '团队建设',
                children: [
                    {
                        name: '专业队伍',
                        children: [
                            { name: '8支团队', value: 8 },
                            { name: '45个新合作伙伴', value: 45 }
                        ]
                    },
                    {
                        name: '风险管控',
                        children: [
                            { name: '风险事件率: 1.3%', value: 1.3 }
                        ]
                    }
                ]
            }
        ]
    }
};

// 创建树状图
function createTreeDiagram() {
    const container = document.getElementById('treeDiagram');
    if (!container || typeof d3 === 'undefined') {
        console.warn('树状图容器或D3.js未找到');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 设置尺寸
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    
    // 创建SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'linear-gradient(135deg, #f8fafc, #f1f5f9)')
        .style('border-radius', '15px');
    
    // 创建缩放行为
    const zoom = d3.zoom()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // 创建主组
    const g = svg.append('g');
    
    // 创建树布局
    const tree = d3.tree()
        .size([height - 100, width - 100]);
    
    // 处理数据
    const root = d3.hierarchy(octoberData.businessTree);
    tree(root);
    
    // 定义连接线
    g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y + 50)
            .y(d => d.x + 50))
        .style('fill', 'none')
        .style('stroke', '#6366f1')
        .style('stroke-width', 2)
        .style('opacity', 0.6);
    
    // 创建节点组
    const node = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y + 50},${d.x + 50})`);
    
    // 添加节点圆圈
    node.append('circle')
        .attr('r', d => d.children ? 8 : 6)
        .style('fill', d => d.children ? '#6366f1' : '#8b5cf6')
        .style('stroke', '#fff')
        .style('stroke-width', 2)
        .style('cursor', 'pointer');
    
    // 添加节点标签
    node.append('text')
        .attr('dy', d => d.children ? -15 : 25)
        .attr('dx', d => d.children ? 0 : 0)
        .style('text-anchor', 'middle')
        .style('font-size', d => d.children ? '14px' : '12px')
        .style('font-weight', d => d.children ? 'bold' : 'normal')
        .style('fill', '#1e293b')
        .text(d => d.data.name)
        .style('pointer-events', 'none');
    
    // 添加悬停效果
    node.on('mouseover', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', d.children ? 12 : 8)
            .style('fill', '#f59e0b');
        
        // 显示详细信息
        showTooltip(event, d);
    })
    .on('mouseout', function(event, d) {
        d3.select(this).select('circle')
            .transition()
            .duration(200)
            .attr('r', d.children ? 8 : 6)
            .style('fill', d.children ? '#6366f1' : '#8b5cf6');
        
        hideTooltip();
    });
    
    // 初始缩放
    svg.call(zoom.transform, d3.zoomIdentity.translate(width/2 - 200, 50).scale(0.8));
}

// 显示工具提示
function showTooltip(event, d) {
    const tooltip = d3.select('body').selectAll('.tooltip').data([1]);
    
    tooltip.enter()
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '10px')
        .style('border-radius', '5px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .merge(tooltip)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .html(() => {
            if (d.data.value) {
                return `<strong>${d.data.name}</strong><br/>数值: ${d.data.value}`;
            }
            return `<strong>${d.data.name}</strong>`;
        });
}

// 隐藏工具提示
function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}

// 创建趋势图
function createTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx || typeof Chart === 'undefined') {
        console.warn('趋势图画布或Chart.js未找到');
        return;
    }
    
    const trendData = octoberData.monthlyTrend;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['八月', '九月', '十月'],
            datasets: [
                {
                    label: '总结算 (万元)',
                    data: [trendData.august.settlement, trendData.september.settlement, trendData.october.settlement],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: '中介费 (万元)',
                    data: [trendData.august.fee, trendData.september.fee, trendData.october.fee],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: '成功率 (%)',
                    data: [trendData.august.success, trendData.september.success, trendData.october.success],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '月度业绩趋势',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '金额 (万元)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '百分比 (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 创建团队分布图
function createTeamChart() {
    const ctx = document.getElementById('teamChart');
    if (!ctx || typeof Chart === 'undefined') {
        console.warn('团队分布图画布或Chart.js未找到');
        return;
    }
    
    const teamData = octoberData.teamDistribution;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(teamData),
            datasets: [{
                data: Object.values(teamData),
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#f59e0b',
                    '#10b981'
                ],
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: '团队分布情况',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            return `${label}: ${value}支团队`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// 创建进度条
function createProgressBars() {
    const progressData = [
        { label: '总结算完成度', value: 95, color: '#6366f1' },
        { label: '团队建设完成度', value: 88, color: '#8b5cf6' },
        { label: '风险控制完成度', value: 92, color: '#10b981' },
        { label: '客户满意度', value: 98, color: '#f59e0b' }
    ];
    
    const progressContainer = document.querySelector('.chart-container');
    if (!progressContainer) return;
    
    const progressSection = document.createElement('div');
    progressSection.className = 'progress-section';
    progressSection.innerHTML = '<h3>业务完成度</h3>';
    
    progressData.forEach(item => {
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        progressItem.innerHTML = `
            <div class="progress-label">
                <span>${item.label}</span>
                <span class="progress-value">${item.value}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="--progress-width: ${item.value}%; background: ${item.color};"></div>
            </div>
        `;
        progressSection.appendChild(progressItem);
    });
    
    progressContainer.appendChild(progressSection);
}

// 创建数据对比卡片
function createComparisonCards() {
    const comparisonData = [
        {
            title: '与九月对比',
            items: [
                { label: '总结算', current: '3,850万', previous: '3,680万', change: '+4.6%', positive: true },
                { label: '中介费', current: '520万', previous: '495万', change: '+5.1%', positive: true },
                { label: '成功率', current: '99.2%', previous: '99%', change: '+0.2%', positive: true },
                { label: '回头率', current: '90%', previous: '89%', change: '+1.1%', positive: true },
                { label: '团队数量', current: '8支', previous: '8支', change: '0%', positive: true },
                { label: '风险事件率', current: '1.3%', previous: '1.5%', change: '-0.2%', positive: true },
                { label: '新增合作伙伴', current: '45个', previous: '41个', change: '+9.8%', positive: true }
            ]
        }
    ];
    
    const reportSection = document.querySelector('.report-section .container');
    if (!reportSection) return;
    
    comparisonData.forEach(comparison => {
        const comparisonCard = document.createElement('div');
        comparisonCard.className = 'comparison-card';
        comparisonCard.innerHTML = `
            <h3>${comparison.title}</h3>
            <div class="comparison-grid">
                ${comparison.items.map(item => `
                    <div class="comparison-item">
                        <div class="comparison-label">${item.label}</div>
                        <div class="comparison-values">
                            <span class="current-value">${item.current}</span>
                            <span class="previous-value">上月: ${item.previous}</span>
                        </div>
                        <div class="comparison-change ${item.positive ? 'positive' : 'negative'}">
                            ${item.change}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        reportSection.appendChild(comparisonCard);
    });
}

// 初始化所有图表
function initializeAllCharts() {
    // 等待DOM完全加载
    setTimeout(() => {
        createTreeDiagram();
        createTrendChart();
        createTeamChart();
        createProgressBars();
        createComparisonCards();
    }, 500);
}

// 响应式图表调整
function handleResize() {
    // 重新创建图表以适应新尺寸
    if (window.innerWidth < 768) {
        // 移动端优化
        const charts = document.querySelectorAll('canvas');
        charts.forEach(chart => {
            chart.style.maxHeight = '300px';
        });
    }
}

// 监听窗口大小变化
window.addEventListener('resize', debounce(handleResize, 300));

// 导出函数
window.createTreeDiagram = createTreeDiagram;
window.createTrendChart = createTrendChart;
window.createTeamChart = createTeamChart;
window.initializeAllCharts = initializeAllCharts;
