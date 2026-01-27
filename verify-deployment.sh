#!/bin/bash
# Favicon & WWW Redirect Verification Script
# Run this AFTER deploying to production

echo "========================================="
echo "Favicon & WWW Redirect Verification"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test URL and check for redirect
test_redirect() {
    local url=$1
    local expected_location=$2
    local description=$3

    echo -n "Testing: $description... "

    # Get HTTP status and Location header
    response=$(curl -s -I -L -w "%{http_code}" "$url" 2>&1)
    http_code=$(echo "$response" | tail -n1)
    location=$(echo "$response" | grep -i "^Location:" | head -n1 | cut -d' ' -f2 | tr -d '\r')

    if [[ $http_code == "301" ]] && [[ $location == *"$expected_location"* ]]; then
        echo -e "${GREEN}✓ PASS${NC} (301 → $location)"
        ((PASSED++))
    elif [[ $http_code == "200" ]] && [[ $url == *"www."* ]]; then
        echo -e "${GREEN}✓ PASS${NC} (200 OK - www version)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code, Location: $location)"
        ((FAILED++))
    fi
}

# Function to test file accessibility
test_file() {
    local url=$1
    local description=$2

    echo -n "Testing: $description... "

    http_code=$(curl -o /dev/null -s -w "%{http_code}" "$url")

    if [[ $http_code == "200" ]]; then
        echo -e "${GREEN}✓ PASS${NC} (200 OK)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        ((FAILED++))
    fi
}

# Function to check canonical tag
test_canonical() {
    local url=$1
    local expected_canonical=$2
    local description=$3

    echo -n "Testing: $description... "

    canonical=$(curl -s "$url" | grep -o '<link rel="canonical"[^>]*>' | grep -o 'href="[^"]*"' | cut -d'"' -f2)

    if [[ $canonical == "$expected_canonical" ]]; then
        echo -e "${GREEN}✓ PASS${NC} (Canonical: $canonical)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected: $expected_canonical, Got: $canonical)"
        ((FAILED++))
    fi
}

echo "===== 1. WWW Redirect Tests ====="
echo ""

test_redirect "https://thoughtmetrics.com" "https://www.thoughtmetrics.com/" "Root domain redirect"
test_redirect "https://thoughtmetrics.com/research-methods/quantitative-research" "https://www.thoughtmetrics.com/research-methods/quantitative-research" "Path redirect (research-methods)"
test_redirect "https://thoughtmetrics.com/industries/retail" "https://www.thoughtmetrics.com/industries/retail" "Path redirect (industries)"
test_redirect "https://thoughtmetrics.com/contact-us" "https://www.thoughtmetrics.com/contact-us" "Path redirect (contact-us)"

echo ""
echo "===== 2. Favicon Accessibility Tests ====="
echo ""

test_file "https://www.thoughtmetrics.com/favicon.ico" "favicon.ico (www)"
test_file "https://www.thoughtmetrics.com/favicon-48.png" "favicon-48.png (www)"
test_file "https://www.thoughtmetrics.com/favicon.svg" "favicon.svg (www)"
test_file "https://www.thoughtmetrics.com/apple-touch-icon.png" "apple-touch-icon.png (www)"
test_file "https://www.thoughtmetrics.com/manifest.json" "manifest.json (www)"

echo ""
echo "===== 3. Favicon Redirect Tests ====="
echo ""

test_redirect "https://thoughtmetrics.com/favicon.ico" "https://www.thoughtmetrics.com/favicon.ico" "favicon.ico redirect"
test_redirect "https://thoughtmetrics.com/favicon-48.png" "https://www.thoughtmetrics.com/favicon-48.png" "favicon-48.png redirect"
test_redirect "https://thoughtmetrics.com/favicon.svg" "https://www.thoughtmetrics.com/favicon.svg" "favicon.svg redirect"

echo ""
echo "===== 4. Canonical Tag Tests ====="
echo ""

test_canonical "https://www.thoughtmetrics.com/" "https://www.thoughtmetrics.com/" "Homepage canonical"
test_canonical "https://www.thoughtmetrics.com/industries/retail" "https://www.thoughtmetrics.com/industries/retail" "Industry page canonical"
test_canonical "https://www.thoughtmetrics.com/research-methods/quantitative-research" "https://www.thoughtmetrics.com/research-methods/quantitative-research" "Research method canonical"

echo ""
echo "===== 5. Favicon Meta Tags Test ====="
echo ""

echo -n "Testing: Favicon meta tags in HTML... "
favicon_tags=$(curl -s "https://www.thoughtmetrics.com/" | grep -c 'rel="icon"')
apple_icon=$(curl -s "https://www.thoughtmetrics.com/" | grep -c 'apple-touch-icon')

if [[ $favicon_tags -ge 3 ]] && [[ $apple_icon -ge 1 ]]; then
    echo -e "${GREEN}✓ PASS${NC} (Found $favicon_tags favicon tags + apple-touch-icon)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Found $favicon_tags favicon tags, $apple_icon apple-touch-icon)"
    ((FAILED++))
fi

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}✓ All tests passed! Deployment successful.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Wait 7-14 days for Google to recrawl"
    echo "2. Monitor Google Search Console for favicon appearance in SERP"
    echo "3. No further action needed"
else
    echo -e "${RED}✗ Some tests failed. Review the output above.${NC}"
    echo ""
    echo "Common issues:"
    echo "1. GoDaddy 'Forward path' not enabled → Enable it in GoDaddy settings"
    echo "2. Application not deployed → Deploy dist/ folder to production"
    echo "3. DNS propagation delay → Wait 5-10 minutes and retry"
    echo "4. Favicon files missing → Ensure public/ folder deployed correctly"
fi

echo ""
echo "========================================="
