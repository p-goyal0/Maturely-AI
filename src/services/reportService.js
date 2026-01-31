/**
 * Report Generation Service
 * Handles PDF report generation with charts and assessment data
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF report from assessment results
 * @param {Object} assessmentResults - Assessment results data
 * @param {HTMLElement} chartElement - Chart container element to capture
 * @param {Object} options - Report options (companyName, date, includeCharts)
 * @returns {Promise<{success: boolean, filename?: string, error?: string}>}
 */
export async function generatePDFReport(assessmentResults, chartElement = null, options = {}) {
  try {
    const {
      companyName = 'Your Organization',
      date = new Date().toLocaleDateString(),
      includeCharts = true,
    } = options;

    // Define pillar short names at the top for use throughout the function
    const PILLAR_SHORT_NAMES = {
      "Strategic Value & Governance": "Strategy & Governance",
      "Workforce Skillset & Organization Structure": "Organization & Workforce",
      "Technology & Data": "Data & Technology",
      "Resilience, Performance & Impact": "Performance & Impact",
      "Ethics, Trust & Responsible AI": "Trust, Ethics & Responsible AI",
      "Compliance, Security & Risk": "Security & Risk",
      "Operations & Implementation": "Operations & Implementation",
    };

    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      lines.forEach((line) => {
        checkPageBreak(8);
        pdf.text(line, margin, yPosition);
        yPosition += 7;
      });
    };

    // Helper function to add section title - Modern design
    const addSectionTitle = (title) => {
      checkPageBreak(20);
      yPosition += 8;
      
      // Section title first
      pdf.setFontSize(15);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      const titleHeight = 7; // Approximate height of text
      pdf.text(title, margin, yPosition);
      
      // Subtle accent line just below the title (very close spacing)
      yPosition += titleHeight - 2; // Reduced spacing to bring line closer to heading
      pdf.setDrawColor(70, 205, 198);
      pdf.setLineWidth(1);
      pdf.line(margin, yPosition, margin + 30, yPosition);
      yPosition += 5;
    };

    // Pillar maturity → color mapping (5-color scheme)
    // Palette (per client): #C03928, #E67E22, #F1C40F, #2ECC71, #27AE60
    const getMaturityColorRGB = (maturityLevel) => {
      switch (maturityLevel) {
        case 'Initial': return [192, 57, 40]; // #C03928
        case 'Adopting': return [230, 126, 34]; // #E67E22
        case 'Established': return [241, 196, 15]; // #F1C40F
        case 'Advanced': return [46, 204, 113]; // #2ECC71 (note: "ZECC71" corrected)
        case 'Transformational': return [39, 174, 96]; // #27AE60
        default: return [70, 205, 198]; // fallback teal
      }
    };

    // Modern Professional Header
    yPosition = margin;
    
    // Add wings logo and AI Maturely logo above the line
    try {
      let maxLogoHeight = 0;
      let currentXPosition = margin;
      
      // Load and add wings logo first
      try {
        const wingsResponse = await fetch('/logo/wings.png');
        if (wingsResponse.ok) {
          const wingsBlob = await wingsResponse.blob();
          const wingsDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(wingsBlob);
          });
          
          // Add wings logo
          const wingsWidth = 10; // 8mm width for wings
          const wingsHeight = 7; // 8mm height for wings (assuming square)
          
          pdf.addImage(wingsDataUrl, 'PNG', currentXPosition, yPosition, wingsWidth, wingsHeight);
          currentXPosition += wingsWidth + 3; // Move position for next logo
          maxLogoHeight = Math.max(maxLogoHeight, wingsHeight);
          
          console.log('Wings logo successfully added to PDF');
        }
      } catch (wingsError) {
        console.warn('Could not load wings logo for PDF:', wingsError);
      }
      
      // Load and add maturely logo after wings
      try {
        const logoResponse = await fetch('/logo/maturely_logo.png');
        if (logoResponse.ok) {
          const logoBlob = await logoResponse.blob();
          const logoDataUrl = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(logoBlob);
          });
          
          // Add maturely logo next to wings
          const logoWidth = 30; // 25mm width for maturely logo
          const logoHeight = 7; // 8mm height to match wings
          
          pdf.addImage(logoDataUrl, 'PNG', currentXPosition, yPosition, logoWidth, logoHeight);
          maxLogoHeight = Math.max(maxLogoHeight, logoHeight);
          
          console.log('Maturely logo successfully added to PDF');
        }
      } catch (logoError) {
        console.warn('Could not load maturely logo for PDF:', logoError);
      }
      
      // Move yPosition based on the tallest logo
      yPosition += Math.max(maxLogoHeight, 8) + 3; // Add spacing after logos
      
    } catch (error) {
      console.warn('Error loading logos for PDF:', error);
      // Continue without logos - just add some top spacing
      yPosition += 2;
    }
    
    // Subtle top border accent
    pdf.setDrawColor(70, 205, 198);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Company name and date - subtle and professional
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(companyName, margin, yPosition);
    pdf.text(`Generated on ${date}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 12;
    
    // Report title - modern and clean
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('AI Readiness Assessment Report', margin, yPosition);
    yPosition += 15;

    // Executive Summary
    const overallScore = assessmentResults?.overall_score || 0;
    const overallMaturity = assessmentResults?.overall_maturity_level || 'Not Available';
    const scorePercentage = Math.round((overallScore / 5) * 100);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 50, 50);
    const summaryText = `Your organization has achieved an overall AI readiness score of ${overallScore.toFixed(2)} out of 5.0, ` +
      `placing you at the "${overallMaturity}" maturity level. This report provides a comprehensive analysis ` +
      `of your organization's AI capabilities across seven key pillars.`;
    const summaryLines = pdf.splitTextToSize(summaryText, contentWidth);
    summaryLines.forEach((line) => {
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 8;

    // Function to draw radar chart directly in PDF - Define early so it can be used later
    // Matches the exact styling from ResultsDashboard page
    const drawRadarChart = (centerX, centerY, radius, data) => {
      try {
        const numPillars = data.length;
        const angleStep = (2 * Math.PI) / numPillars;
        const maxScore = 5;

        console.log(`Drawing radar chart with ${numPillars} pillars at center (${centerX}, ${centerY}) with radius ${radius}`);

        // Draw grid circles (1, 2, 3, 4, 5) - light gray like on page
        pdf.setDrawColor(107, 114, 128); // rgba(107, 114, 128, 0.2) equivalent
        pdf.setLineWidth(0.3);
        for (let i = 1; i <= maxScore; i++) {
          const circleRadius = (radius * i) / maxScore;
          pdf.circle(centerX, centerY, circleRadius, 'D'); // 'D' for draw only
        }

        // Draw axis lines - light gray
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.2);
        
        data.forEach((pillar, index) => {
          const angle = -Math.PI / 2 + index * angleStep; // Start from top
          const endX = centerX + Math.cos(angle) * radius;
          const endY = centerY + Math.sin(angle) * radius;

          // Draw axis line
          pdf.line(centerX, centerY, endX, endY);
        });

        // Draw labels - FULL NAMES without truncation
        pdf.setFontSize(9);
        pdf.setTextColor(55, 65, 81); // #374151 equivalent
        pdf.setFont('helvetica', 'normal');

        data.forEach((pillar, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          
          // Position label further outside the circle to accommodate full names
          const labelDistance = radius + 20;
          const labelX = centerX + Math.cos(angle) * labelDistance;
          const labelY = centerY + Math.sin(angle) * labelDistance;

          // Adjust text alignment based on position
          let align = 'center';
          if (labelX > centerX + 5) align = 'left';
          else if (labelX < centerX - 5) align = 'right';
          
          // Show FULL name - no truncation
          pdf.text(pillar.name, labelX, labelY, { align: align });
        });

        // Calculate data points
        const points = data.map((pillar, index) => {
          const angle = -Math.PI / 2 + index * angleStep;
          const scoreRadius = (radius * pillar.score) / maxScore;
          return {
            x: centerX + Math.cos(angle) * scoreRadius,
            y: centerY + Math.sin(angle) * scoreRadius,
            score: pillar.score
          };
        });

        // Draw filled polygon with teal color (#14b8a6 = RGB 20, 184, 166)
        // Fill opacity 0.6 - we'll use a lighter fill color to simulate transparency
        if (points.length > 0) {
          // Create path for filled area
          let pathString = `M ${points[0].x} ${points[0].y}`;
          for (let i = 1; i < points.length; i++) {
            pathString += ` L ${points[i].x} ${points[i].y}`;
          }
          pathString += ' Z'; // Close path
          
          // Teal color with opacity simulation (lighter shade for fill)
          // Base color: #14b8a6 (20, 184, 166)
          // For 0.6 opacity on white: blend with white
          const fillR = Math.round(20 + (255 - 20) * 0.4); // 114
          const fillG = Math.round(184 + (255 - 184) * 0.4); // 212
          const fillB = Math.round(166 + (255 - 166) * 0.4); // 200
          
          pdf.setFillColor(fillR, fillG, fillB);
          pdf.setDrawColor(20, 184, 166); // Solid teal for stroke
          pdf.setLineWidth(0.7); // 2.5px equivalent in mm
          
          // Draw filled area first, then stroke
          pdf.path(pathString, 'F'); // Fill only
          pdf.path(pathString, 'S'); // Stroke only
        }

        // Draw score points as circles with teal fill and white border
        // Match the dot styling: r: 5, fill: '#14b8a6', strokeWidth: 2, stroke: '#ffffff'
        pdf.setFillColor(20, 184, 166); // Teal
        pdf.setDrawColor(255, 255, 255); // White border
        pdf.setLineWidth(0.3); // Border width
        
        points.forEach(point => {
          // Draw white border circle (slightly larger)
          pdf.circle(point.x, point.y, 1.5, 'D');
          // Draw filled teal circle
          pdf.circle(point.x, point.y, 1.2, 'F');
        });

        console.log('Radar chart drawing completed successfully');
        return true;
        
      } catch (error) {
        console.error('Error in drawRadarChart:', error);
        return false;
      }
    };

    // Overall Score Card - Modern Design
    checkPageBreak(40);
    pdf.setFillColor(250, 250, 250);
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(margin, yPosition, contentWidth, 30, 4, 4, 'FD');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Overall Score', margin + 8, yPosition + 10);
    
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(70, 205, 198);
    pdf.text(`${overallScore.toFixed(2)} / 5.0`, margin + 8, yPosition + 22);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Maturity Level: ${overallMaturity}`, margin + contentWidth - 8, yPosition + 22, { align: 'right' });
    
    yPosition += 35;

    // Capture and add radar chart on first page
    if (includeCharts) {
      try {
        // Add section title for radar chart
        addSectionTitle('Maturity Profile (Radar Chart)');
        
        // Wait longer for charts to fully render and be visible
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // ULTRA AGGRESSIVE SIZING - Use nearly entire page
        const availableSpace = pageHeight - yPosition - 5; // Almost no bottom margin
        const maxChartHeight = availableSpace; // Use ALL remaining space
        
        // Debug: Check if radar chart elements exist
        console.log('Searching for radar chart elements...');
        
        // Try multiple ways to find the radar chart section
        let radarSection = null;
        
        // Method 1: Look for section with data-radar-section
        radarSection = document.querySelector('section[data-radar-section]');
        console.log('Method 1 - section[data-radar-section]:', radarSection);
        
        // Method 2: Look for element with data-radar-chart and find its section parent
        if (!radarSection) {
          const radarChart = document.querySelector('[data-radar-chart]');
          radarSection = radarChart?.closest('section');
          console.log('Method 2 - [data-radar-chart] parent section:', radarSection);
        }
        
        // Method 3: Look for section containing RadarChart
        if (!radarSection) {
          const allSections = document.querySelectorAll('section');
          for (const section of allSections) {
            if (section.querySelector('.recharts-radar') || section.textContent.includes('Maturity Profile')) {
              radarSection = section;
              console.log('Method 3 - section with radar content:', radarSection);
              break;
            }
          }
        }
        
        console.log('Final radar section found:', radarSection);
        
        // ============================================
        // Option 1: Canvas → PNG → PDF (Recommended)
        // Capture the rendered Recharts SVG chart from DOM and embed as image
        // This ensures the PDF shows exactly what's displayed on the page
        // ============================================ (Option 1: Canvas → PNG → PDF)
        const radarChartContainer = document.querySelector('[data-radar-chart]');
        
        if (radarChartContainer && includeCharts) {
          try {
            console.log('Capturing radar chart from DOM using html2canvas...');
            
            // Wait a bit to ensure chart is fully rendered
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Find the chart container - prefer ResponsiveContainer div, then SVG, then fallback to container
            let chartElement = radarChartContainer.querySelector('.recharts-responsive-container') ||
                              radarChartContainer.querySelector('.recharts-wrapper') ||
                              radarChartContainer.querySelector('svg') ||
                              radarChartContainer.querySelector('div[style*="width"]') ||
                              radarChartContainer;
            
            // Ensure we have a valid element with dimensions
            if (!chartElement.offsetWidth || !chartElement.offsetHeight) {
              // Try to get dimensions from parent or use defaults
              const parent = chartElement.parentElement;
              if (parent && (parent.offsetWidth || parent.offsetHeight)) {
                chartElement = parent;
              }
            }
            
            if (chartElement) {
              console.log('Chart element found, capturing as PNG image...', {
                width: chartElement.offsetWidth,
                height: chartElement.offsetHeight,
                element: chartElement.tagName
              });
              
              // Use html2canvas to capture the chart (Canvas → PNG)
              const canvas = await html2canvas(chartElement, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher quality for PDF
                logging: false,
                useCORS: true,
                allowTaint: false,
                width: chartElement.offsetWidth || chartElement.scrollWidth || 800,
                height: chartElement.offsetHeight || chartElement.scrollHeight || 550,
                windowWidth: chartElement.offsetWidth || 800,
                windowHeight: chartElement.offsetHeight || 550,
              });
              
              // Crop extra whitespace from the captured canvas so the chart appears larger in PDF
              const trimCanvas = (sourceCanvas, paddingPx = 24) => {
                const ctx = sourceCanvas.getContext('2d');
                if (!ctx) return sourceCanvas;
                const { width, height } = sourceCanvas;
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                const isNonWhite = (r, g, b, a) => {
                  // treat near-white as background
                  if (a === 0) return false;
                  return !(r > 245 && g > 245 && b > 245);
                };

                let minX = width, minY = height, maxX = 0, maxY = 0;
                let found = false;

                for (let y = 0; y < height; y++) {
                  for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];
                    if (isNonWhite(r, g, b, a)) {
                      found = true;
                      if (x < minX) minX = x;
                      if (y < minY) minY = y;
                      if (x > maxX) maxX = x;
                      if (y > maxY) maxY = y;
                    }
                  }
                }

                if (!found) return sourceCanvas;

                minX = Math.max(0, minX - paddingPx);
                minY = Math.max(0, minY - paddingPx);
                maxX = Math.min(width - 1, maxX + paddingPx);
                maxY = Math.min(height - 1, maxY + paddingPx);

                const cropW = maxX - minX + 1;
                const cropH = maxY - minY + 1;

                const out = document.createElement('canvas');
                out.width = cropW;
                out.height = cropH;
                const outCtx = out.getContext('2d');
                if (!outCtx) return sourceCanvas;

                outCtx.fillStyle = '#ffffff';
                outCtx.fillRect(0, 0, cropW, cropH);
                outCtx.drawImage(sourceCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
                return out;
              };

              const trimmedCanvas = trimCanvas(canvas, 28);

              // Convert (trimmed) canvas to base64 PNG image
              const imageData = trimmedCanvas.toDataURL('image/png', 1.0);
              
              // Move chart slightly down from the heading (more visual breathing room)
              // (Does not reduce chart size materially because we still fit-to-page below.)
              // Slightly lower than the heading, but keep it on page 1
              yPosition += 5;

              // Calculate dimensions for PDF (maximize size on page)
              // Use (nearly) full page width + as much height as possible, keeping aspect ratio.
              // Make it a bit smaller so it doesn't spill to the next page.
              const imageSideMargin = 14; // increase side margins to reduce width
              const maxImgWidth = pageWidth - imageSideMargin * 2;
              // Use same bottom threshold as checkPageBreak logic (pageHeight - margin)
              const maxImgHeight = (pageHeight - margin) - yPosition - 8;

              let imgWidth = maxImgWidth;
              let imgHeight = (trimmedCanvas.height * imgWidth) / trimmedCanvas.width;

              // If it doesn't fit vertically, scale down to fit height
              if (imgHeight > maxImgHeight) {
                imgHeight = maxImgHeight;
                imgWidth = (trimmedCanvas.width * imgHeight) / trimmedCanvas.height;
              }

              // Check if we need a new page (use final computed height)
              checkPageBreak(imgHeight + 8);

              // Center image horizontally
              const imgX = (pageWidth - imgWidth) / 2;

              // Add image to PDF
              pdf.addImage(imageData, 'PNG', imgX, yPosition, imgWidth, imgHeight);

              yPosition += imgHeight + 15;
              console.log('✅ Radar chart captured and added to PDF successfully', {
                imgWidth: imgWidth.toFixed(2),
                imgHeight: imgHeight.toFixed(2)
              });
            } else {
              throw new Error('Chart element not found or has no dimensions');
            }
          } catch (captureError) {
            console.error('Failed to capture radar chart:', captureError);
            // Fallback to manual drawing
            console.log('Falling back to manual chart drawing...');
            
            if (assessmentResults?.pillar_results) {
              const sortedPillars = assessmentResults.pillar_results
                .sort((a, b) => a.pillar_order - b.pillar_order);
              
              const chartData = sortedPillars.map(pillar => ({
                name: PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name,
                score: pillar.average_score
              }));
              
              // Calculate chart dimensions
              const availableWidth = contentWidth;
              const availableHeight = pageHeight - yPosition - 40;
              const maxSize = Math.min(availableWidth, availableHeight) * 0.65;
              
              const chartCenterX = margin + contentWidth / 2;
              const chartCenterY = yPosition + maxSize / 2 + 25;
              const chartRadius = maxSize / 3.5;
              
              const success = drawRadarChart(chartCenterX, chartCenterY, chartRadius, chartData);
              
              if (success) {
                yPosition = chartCenterY + chartRadius + 50;
              } else {
                throw new Error('Manual chart drawing also failed');
              }
            }
          }
        } else if (assessmentResults?.pillar_results) {
          // Fallback: Manual drawing if chart element not found
          console.log('Chart element not found, using manual drawing...');
          
          const sortedPillars = assessmentResults.pillar_results
            .sort((a, b) => a.pillar_order - b.pillar_order);
          
          const chartData = sortedPillars.map(pillar => ({
            name: PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name,
            score: pillar.average_score
          }));
          
          const availableWidth = contentWidth;
          const availableHeight = pageHeight - yPosition - 40;
          const maxSize = Math.min(availableWidth, availableHeight) * 0.65;
          
          const chartCenterX = margin + contentWidth / 2;
          const chartCenterY = yPosition + maxSize / 2 + 25;
          const chartRadius = maxSize / 3.5;
          
          const success = drawRadarChart(chartCenterX, chartCenterY, chartRadius, chartData);
          
          if (success) {
            yPosition = chartCenterY + chartRadius + 50;
          } else {
            addText('Chart could not be generated.', 10, false, [150, 150, 150]);
            yPosition += 5;
          }
        } else {
          console.error('Radar chart section not found and no data available');
          addText('Radar chart not available.', 10, false, [150, 150, 150]);
          yPosition += 5;
        }
        
      } catch (chartError) {
        console.error('Error capturing charts:', chartError);
        addText('Note: Charts could not be included in this report.', 10, false, [150, 150, 150]);
        yPosition += 5;
      }
    }

    // (PILLAR_SHORT_NAMES already defined at top of function)
    // (drawRadarChart function moved to top of function for proper initialization)

    // Pillar Scores - Start on new page (2nd page)
    if (assessmentResults?.pillar_results && assessmentResults.pillar_results.length > 0) {
      // Add new page for Pillar-wise Performance section
      pdf.addPage();
      yPosition = margin;
      
      addSectionTitle('Pillar-wise Performance');

      const sortedPillars = [...assessmentResults.pillar_results].sort(
        (a, b) => a.pillar_order - b.pillar_order
      );

      // Render pillar cards in a 2-column grid (PDF-optimized spacing)
      // Wider cards come from smaller inter-column gap.
      const gridGap = 4; // decreased gap -> increases each card's width
      const cardWidth = (contentWidth - gridGap) / 2;
      const cardHeight = 40; // decreased height (less tall cards)
      const cardRadius = 5;

      // After the section title, keep a little spacing before cards
      yPosition += 2;
      let gridStartY = yPosition;

      const drawPillarCard = (x, y, pillarName, scoreNum, maturity, color) => {
        const [r, g, b] = color;

        // Absolute layout constants inside the card (PDF-friendly vertical grid)
        // Goal: even, relaxed spacing between title row, progress bar, and pill.
        const padX = 8;
        const rightPad = 8;
        const padTop = 6;
        const padBottom = 4; // tighter bottom padding
        const gapAfterTitle = 8;
        const gapAfterBar = 4; // reduce space between bar and maturity pill

        // Card container
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.7);
        pdf.roundedRect(x, y, cardWidth, cardHeight, cardRadius, cardRadius, 'FD');

        // Title block (wrap instead of truncating with "...")
        const titleX = x + padX + 7.2;
        const titleTopY = y + padTop; // top of title block
        const titleMaxWidth = cardWidth - (titleX - x) - rightPad;
        const titleLineHeight = 4.8;

        // Icon ring (left) - aligned to first title line
        const iconCx = x + padX;
        const iconCy = titleTopY + 3.6; // optical alignment with first line
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(r, g, b);
        pdf.setLineWidth(1.1);
        pdf.circle(iconCx, iconCy, 3.0, 'FD'); // white fill with colored stroke
        pdf.setFillColor(r, g, b);
        pdf.setDrawColor(r, g, b);
        pdf.setLineWidth(0.1);
        pdf.circle(iconCx, iconCy, 1.25, 'F'); // inner dot

        // Title (top) — wrap to avoid ellipsis
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11.5);
        pdf.setTextColor(0, 0, 0);

        const titleLines = pdf.splitTextToSize(String(pillarName), Math.max(10, titleMaxWidth));
        const visibleTitleLines = titleLines.slice(0, 2); // keep layout clean in fixed-height cards
        visibleTitleLines.forEach((line, idx) => {
          pdf.text(line, titleX, titleTopY + (idx * titleLineHeight) + 4.2);
        });

        // Progress bar + pill are anchored from the bottom for consistent bottom padding
        const barPadX = 6;
        const trackX = x + barPadX;
        const trackW = cardWidth - barPadX * 2;
        const trackH = 3.6; // slimmer bar
        const pct = Math.max(0, Math.min(1, scoreNum / 5));
        const fillW = trackW * pct;

        // Pill (bottom-left) anchored to the bottom of the card
        const pillText = maturity;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const textW = pdf.getTextWidth(pillText);
        const pillW = Math.min(trackW, textW + 14);
        const pillH = 6.4; // slimmer pill height
        const pillX = trackX;
        const pillY = y + cardHeight - padBottom - pillH;

        // Bar sits above the pill with controlled gap
        const trackY = pillY - gapAfterBar - trackH;

        pdf.setFillColor(236, 239, 243); // soft gray track
        pdf.setDrawColor(236, 239, 243);
        pdf.roundedRect(trackX, trackY, trackW, trackH, 2.6, 2.6, 'F');

        pdf.setFillColor(r, g, b);
        pdf.setDrawColor(r, g, b);
        pdf.roundedRect(trackX, trackY, Math.max(0.8, fillW), trackH, 2.6, 2.6, 'F');

        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(r, g, b);
        pdf.setLineWidth(0.7);
        pdf.roundedRect(pillX, pillY, pillW, pillH, 3, 3, 'D');

        pdf.setTextColor(r, g, b);
        pdf.text(pillText, pillX + pillW / 2, pillY + 4.4, { align: 'center' });

        // Score (below progress bar, right-aligned) — replaces top-row score
        const scoreText = `${scoreNum.toFixed(1)} / 5`;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10.5);
        pdf.setTextColor(60, 60, 60);
        pdf.text(scoreText, x + cardWidth - rightPad, pillY + 4.4, { align: 'right' });
      };

      const ensureGridSpace = (neededHeight) => {
        const bottomLimit = pageHeight - margin - 18; // keep extra space for footer/air
        if (gridStartY + neededHeight > bottomLimit) {
          pdf.addPage();
          yPosition = margin;
          addSectionTitle('Pillar-wise Performance (cont.)');
          yPosition += 2;
          gridStartY = yPosition;
        }
      };

      sortedPillars.forEach((pillar, index) => {
        const pillarName = PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name;
        const scoreNum = typeof pillar.average_score === 'number'
          ? pillar.average_score
          : parseFloat(pillar.average_score) || 0;
        const maturity = pillar.maturity_level || 'N/A';
        const color = getMaturityColorRGB(pillar.maturity_level);

        // Row/col placement
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = margin + col * (cardWidth + gridGap);
        const y = gridStartY + row * (cardHeight + gridGap);

        // Ensure page has enough room for this row
        if (col === 0) {
          // Ensure at least one full card row fits (absolute row height)
          ensureGridSpace(row * (cardHeight + gridGap) + cardHeight);
        }

        // If we paged, recompute y with updated gridStartY
        const yFinal = gridStartY + row * (cardHeight + gridGap);
        drawPillarCard(x, yFinal, pillarName, scoreNum, maturity, color);
      });

      // Move yPosition to after the grid for next sections
      const rowsRendered = Math.ceil(sortedPillars.length / 2);
      yPosition = gridStartY + rowsRendered * (cardHeight + gridGap) + 6;
    }

    // Key Insights
    addSectionTitle('Key Insights');
    addText(
      'This assessment evaluates your organization across seven critical pillars of AI maturity. ' +
      'Use the detailed scores and recommendations to identify areas for improvement and prioritize ' +
      'your AI transformation initiatives.',
      11,
      false,
      [50, 50, 50]
    );
    yPosition += 10;

    // Footer on each page
    const addFooter = () => {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Page ${i} of ${pageCount} | AI Readiness Assessment Report - ${companyName}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    };

    addFooter();

    // Generate filename
    const filename = `AI_Readiness_Report_${companyName.replace(/\s+/g, '_')}_${date.replace(/\//g, '_')}.pdf`;

    // Save PDF
    pdf.save(filename);

    return {
      success: true,
      filename,
    };
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate PDF report',
    };
  }
}
