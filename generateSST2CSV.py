import xarray as xr
import pandas as pd

#Load data
ds = xr.open_dataset("sst.mnmean.nc")

#Kig på variable for at forstå datastrukturen
print(ds)

#Prøv først uden filter — hvad er shape, min/max?
print(ds['sst'])

#Tjek værdier i en lille region, fx Atlanten
sst_na = ds['sst'].sel(lat=slice(60, 0), lon=slice(280, 360))
print("Subset:", sst_na)

#Drop NaNs og gem nogle prøvedata
sst_df = sst_na.mean(dim=["lat", "lon"], skipna=True).to_dataframe().dropna()

#Hent år og grupér
sst_df["year"] = sst_df.index.year
sst_annual = sst_df.groupby("year").mean().reset_index()

#Tilføj fiktivt år
sst_2035 = pd.DataFrame({
    "year": [2035],
    "sst": [sst_annual["sst"].mean() + 0.5]
})
sst_annual = pd.concat([sst_annual, sst_2035], ignore_index=True)

#Gem fil
sst_annual.to_csv("sst_domino.csv", index=False)
print("✅ Gemte sst_domino.csv med:", len(sst_annual), "rækker")