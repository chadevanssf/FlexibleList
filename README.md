# FlexibleList

<!-- markdownlint-disable MD007 -->
<!-- TOC -->

- [FlexibleList](#flexiblelist)
    - [Deployment Options](#deployment-options)
        - [Deploy using SFDX](#deploy-using-sfdx)
        - [Deploy via Metadata API](#deploy-via-metadata-api)
    - [FlexibleList component](#flexiblelist-component)
    - [FlexibleListItem component (record display)](#flexiblelistitem-component-record-display)
    - [AnythingPathListCard (record display)](#anythingpathlistcard-record-display)
    - [AnythingPathList component](#anythingpathlist-component)
    - [Sample Data](#sample-data)
        - [Import Sample Data](#import-sample-data)
        - [Export Sample Data](#export-sample-data)

<!-- /TOC -->
<!-- markdownlint-enable MD007 -->

Creates a lightning component for displaying a list of records.

## Deployment Options

### Deploy using SFDX

[![Deploy](https://deploy-to-sfdx.com/dist/assets/images/DeployToSFDX.svg)](https://deploy-to-sfdx.com/deploy?template=https://github.com/chadevanssf/flexible-list)

### Deploy via Metadata API

<!-- markdownlint-disable MD033 -->
<a href="https://githubsfdeploy.herokuapp.com">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>
<!-- markdownlint-enable MD033 -->

## FlexibleList component

Drag onto a home, tab, or community page.  Pick the fields that are displayed, component for displaying each record, etc.

## FlexibleListItem component (record display)

Basic field display

## AnythingPathListCard (record display)

Basic field display + AnythingPath

- Use Additional Fields to set field for path to use

## AnythingPathList component

Pre-wired up using FlexibleList with AnythingPathListCard

## Sample Data

### Import Sample Data

```bash
sfdx force:user:permset:assign --permsetname Flexible_List
sfdx force:data:tree:import -p ./data/TestList__c-plan.json
```

### Export Sample Data

```bash
sfdx force:data:tree:export --outputdir ./data --query ./data/testdata.soql --plan
```
