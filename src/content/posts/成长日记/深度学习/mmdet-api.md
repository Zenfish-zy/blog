---
title: "MMDetection 接口文档"
published: 2026-02-05
tags:
  - MMDetection
  - API
category:
  - 成长日记
  - 深度学习
  - MMDetection
description: "MMDetection 框架 API 文档索引，包括 mmdet.apis、datasets、engine、evaluation、models 等模块"
---

# mmdet.apis

# mmdet.datasets

## datasets

## api_wrappers

## samplers

## transforms

# mmdet.engine

## hooks

## optimizers

## runner

## schedulers

# mmdet.evaluation



## functional

- mmdet.evaluation.functional.average_precision(*recalls*, *precisions*, *mode='area'*)[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/mean_ap.html#average_precision)

  Calculate average precision (for single or multiple scales).参数**recalls** (*ndarray*) – shape (num_scales, num_dets) or (num_dets, )**precisions** (*ndarray*) – shape (num_scales, num_dets) or (num_dets, )**mode** (*str*) – 'area' or '11points', 'area' means calculating the area under precision-recall curve, '11points' means calculating the average precision of recalls at [0, 0.1, …, 1]返回calculated average precision返回类型float or ndarray

- mmdet.evaluation.functional.bbox_overlaps(*bboxes1*, *bboxes2*, *mode='iou'*, *eps=1e-06*, *use_legacy_coordinate=False*)[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/bbox_overlaps.html#bbox_overlaps)

  Calculate the ious between each bbox of bboxes1 and bboxes2.参数**bboxes1** (*ndarray*) – Shape (n, 4)**bboxes2** (*ndarray*) – Shape (k, 4)**mode** (*str*) – IOU (intersection over union) or IOF (intersection over foreground)**use_legacy_coordinate** (*bool*) – Whether to use coordinate system in mmdet v1.x. which means width, height should be calculated as 'x2 - x1 + 1` and 'y2 - y1 + 1' respectively. Note when function is used in VOCDataset, it should be True to align with the official implementation http://host.robots.ox.ac.uk/pascal/VOC/voc2012/VOCdevkit_18-May-2011.tar Default: False.返回Shape (n, k)返回类型ious (ndarray)

- mmdet.evaluation.functional.cityscapes_classes() → list[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/class_names.html#cityscapes_classes)

  Class names of Cityscapes.

- mmdet.evaluation.functional.coco_classes() → list[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/class_names.html#coco_classes)

  Class names of COCO.

- mmdet.evaluation.functional.coco_panoptic_classes() → list[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/class_names.html#coco_panoptic_classes)

  Class names of COCO panoptic.

- mmdet.evaluation.functional.eval_map(*det_results*, *annotations*, *scale_ranges=None*, *iou_thr=0.5*, *ioa_thr=None*, *dataset=None*, *logger=None*, *tpfp_fn=None*, *nproc=4*, *use_legacy_coordinate=False*, *use_group_of=False*, *eval_mode='area'*)[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/mean_ap.html#eval_map)

  Evaluate mAP of a dataset.

- mmdet.evaluation.functional.eval_recalls(*gts*, *proposals*, *proposal_nums=None*, *iou_thrs=0.5*, *logger=None*, *use_legacy_coordinate=False*)[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/recall.html#eval_recalls)

  Calculate recalls.

- mmdet.evaluation.functional.get_classes(*dataset*) → list[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/class_names.html#get_classes)

  Get class names of a dataset.

- mmdet.evaluation.functional.voc_classes() → list[[源代码\]](https://mmdetection.readthedocs.io/zh-cn/latest/_modules/mmdet/evaluation/functional/class_names.html#voc_classes)

  Class names of PASCAL VOC.

## metrics

# mmdet.models

## backbones

## data_preprocessors

## dense_heads

## detectors

## layers

## losses

## necks

## roi_heads

## seg_heads

## task_modules

## test_time_augs

## utils

# mmdet.structures



## structures

- *class*mmdet.structures.DetDataSample

  A data structure interface of MMDetection. They are used as interfaces between different components.

- *class*mmdet.structures.ReIDDataSample

  A data structure interface of ReID task.

- *class*mmdet.structures.TrackDataSample

  A data structure interface of tracking task in MMDetection.

## bbox

## mask

# mmdet.testing

# mmdet.visualization



# mmdet.utils

- *class*mmdet.utils.AvoidOOM(*to_cpu=True*, *test=False*)

  Try to convert inputs to FP16 and CPU if got a PyTorch's CUDA Out of Memory error.

- mmdet.utils.all_reduce_dict(*py_dict*, *op='sum'*, *group=None*, *to_float=True*)

  Apply all reduce function for python dict object.

- mmdet.utils.allreduce_grads(*params*, *coalesce=True*, *bucket_size_mb=- 1*)

  Allreduce gradients.

- mmdet.utils.collect_env()

  Collect the information of the running environments.

- mmdet.utils.compat_cfg(*cfg*)

  This function would modify some filed to keep the compatibility of config.

- mmdet.utils.find_latest_checkpoint(*path*, *suffix='pth'*)

  Find the latest checkpoint from the working directory.

- mmdet.utils.register_all_modules(*init_default_scope: bool = True*) → None

  Register all modules in mmdet into the registries.

- mmdet.utils.sync_random_seed(*seed=None*, *device='cuda'*)

  Make sure different ranks share the same seed.
