import yfinance as yf
import pandas as pd
import json

def compute_strategy(symbol="AAPL", start="2025-01-01", end="2025-01-05", capital=10000):
    print(f"Downloading data for {symbol}...")
    data = yf.download(symbol, start=start, end=end)

    if data.empty:
        print(f"No data found for {symbol}, skipping...")
        return None

    data['Return'] = data['Close'].pct_change()
    data['MA10'] = data['Close'].rolling(10).mean()
    data['MA50'] = data['Close'].rolling(50).mean()
    data['Signal'] = 0
    data.loc[data['MA10'] > data['MA50'], 'Signal'] = 1
    data.loc[data['MA10'] < data['MA50'], 'Signal'] = -1
    data['Position'] = data['Signal'].shift(1)
    data['Strategy_Return'] = data['Position'] * data['Return']
    data['Equity_Curve'] = (1 + data['Strategy_Return']).cumprod() * capital
    data['Market_Curve'] = (1 + data['Return']).cumprod() * capital
    data['Price'] = data['Close']

    # Round float columns to 2 decimals
    float_cols = ['Price', 'Close', 'High', 'Low', 'Open', 'Return', 'MA10', 'MA50', 'Signal', 'Position', 'Strategy_Return', 'Equity_Curve', 'Market_Curve']
    for col in float_cols:
        if col in data.columns:
            data[col] = data[col].round(2)

    if 'Volume' in data.columns:
        data['Volume'] = data['Volume'].astype('int64')

    data['Stock_Name'] = symbol

    cols = ['Stock_Name', 'Price', 'Close', 'High', 'Low', 'Open', 'Return', 'MA10', 'MA50', 
            'Signal', 'Position', 'Strategy_Return', 'Equity_Curve', 'Market_Curve']
    data = data[cols]

    # Prepare metrics dictionary
    metrics = {
        "Stock_Name": symbol,
        "Total Return": f"{(data['Equity_Curve'].iloc[-1] / capital - 1):.2%}",
        "Win Rate": f"{(data['Strategy_Return'] > 0).sum() / len(data):.2%}"
    }

    return data, metrics


if __name__ == "__main__":
    print("Fetching S&P 500 tickers from Wikipedia...")
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    tables = pd.read_html(url)
    sp500_df = tables[0]
    tickers = sp500_df['Symbol'].tolist()

    print(f"Total tickers fetched: {len(tickers)}")

    combined_data = []
    all_metrics = []

    for ticker in tickers:
        try:
            result = compute_strategy(symbol=ticker)
            if result is not None:
                data, metrics = result
                combined_data.append(data)
                all_metrics.append(metrics)
        except Exception as e:
            print(f"Error processing {ticker}: {e}")

    if combined_data:
        full_df = pd.concat(combined_data)
        full_df.to_csv("strategy_results_all_tickers.csv", float_format='%.2f', index=True)
        print("Saved combined strategy results to strategy_results_all_tickers.csv")

    with open("performance_metrics_all.json", "w") as f:
        json.dump(all_metrics, f)
    print("Saved all performance metrics to performance_metrics_all.json")
